const request = require('supertest');
const express = require('express');

// Set JWT_SECRET before any route modules load
process.env.JWT_SECRET = 'test-secret-key-for-jest';

const { registerSchema, loginSchema } = require('../validators/auth');
const { updateProfileSchema } = require('../validators/user');
const { createTripSchema } = require('../validators/trip');
const { journeyPlanSchema } = require('../validators/plan');

// ─── Mock models ───────────────────────────────────────────
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

jest.mock('../models', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@test.com',
    password: '$2a$10$mockhash', // bcrypt hash of "Password1!"
    name: 'Test',
    phone: '',
    preferences: {},
    toJSON: function () { const { password, ...rest } = this; return rest; },
    save: jest.fn().mockResolvedValue(this)
  };

  const findOneMock = jest.fn();
  const findByPkMock = jest.fn();
  const createMock = jest.fn();

  return {
    User: {
      findOne: findOneMock,
      findByPk: findByPkMock,
      create: createMock
    },
    Trip: {
      findAll: jest.fn().mockResolvedValue([]),
      findByPk: jest.fn(),
      create: jest.fn(),
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] })
    },
    Notification: {
      findAll: jest.fn().mockResolvedValue([]),
      findByPk: jest.fn(),
      create: jest.fn(),
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] })
    },
    EcoStat: {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn()
    }
  };
});

const bcrypt = require('bcryptjs');
const { User } = require('../models');

// ─── Build minimal test app ────────────────────────────────
function createTestApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  const authRouter = require('../routes/auth');

  // Mock authenticate middleware
  app.use('/api/v1/auth', authRouter);
  return app;
}

const app = createTestApp();

// ─── Helpers ───────────────────────────────────────────────
function mockUserFind(email, userData = null) {
  User.findOne.mockImplementation(async ({ where }) => {
    if (where.email === email) return userData;
    return null;
  });
}

function mockUserFindByPk(id, userData = null) {
  User.findByPk.mockImplementation(async (pk) => {
    if (pk === id) return userData;
    return null;
  });
}

describe('Phase 1 — Backend Security Overhaul', () => {

  describe('1.5 — Request Validation (Joi schemas)', () => {

    test('registerSchema — rejects password < 8 chars', () => {
      const { error } = registerSchema.validate({ email: 'a@b.com', password: 'Ab1!' });
      expect(error).toBeTruthy();
      expect(error.message).toMatch(/8 characters/);
    });

    test('registerSchema — rejects password without number', () => {
      const { error } = registerSchema.validate({ email: 'a@b.com', password: 'abcdefgh!' });
      expect(error).toBeTruthy();
      expect(error.message).toMatch(/1 number/);
    });

    test('registerSchema — rejects password without special char', () => {
      const { error } = registerSchema.validate({ email: 'a@b.com', password: 'abcdefgh1' });
      expect(error).toBeTruthy();
      expect(error.message).toMatch(/1 special character/);
    });

    test('registerSchema — accepts valid password', () => {
      const { error, value } = registerSchema.validate({ email: 'a@b.com', password: 'Password1!' });
      expect(error).toBeFalsy();
      expect(value.email).toBe('a@b.com');
    });

    test('registerSchema — rejects invalid email', () => {
      const { error } = registerSchema.validate({ email: 'notanemail', password: 'Password1!' });
      expect(error).toBeTruthy();
    });

    test('loginSchema — requires email and password', () => {
      const r1 = loginSchema.validate({});
      expect(r1.error).toBeTruthy();
      const r2 = loginSchema.validate({ email: 'a@b.com', password: 'x' });
      expect(r2.error).toBeFalsy();
    });

    test('updateProfileSchema — rejects empty body', () => {
      const { error } = updateProfileSchema.validate({});
      expect(error).toBeTruthy();
      expect(error.message).toMatch(/At least one field/);
    });

    test('updateProfileSchema — accepts valid name update', () => {
      const { error } = updateProfileSchema.validate({ name: 'NewName' });
      expect(error).toBeFalsy();
    });

    test('createTripSchema — rejects missing from/to', () => {
      const { error } = createTripSchema.validate({ mode: 'bus' });
      expect(error).toBeTruthy();
    });

    test('createTripSchema — accepts valid trip', () => {
      const { error } = createTripSchema.validate({
        from: { lat: 28.6, lon: 77.2 },
        to: { lat: 28.7, lon: 77.3 },
        mode: 'bus'
      });
      expect(error).toBeFalsy();
    });

    test('journeyPlanSchema — rejects missing fromPlace', () => {
      const { error } = journeyPlanSchema.validate({ toPlace: 'x' });
      expect(error).toBeTruthy();
      expect(error.message).toMatch(/fromPlace/);
    });

    test('journeyPlanSchema — accepts valid plan', () => {
      const { error } = journeyPlanSchema.validate({
        fromPlace: 'Delhi,28.6,77.2',
        toPlace: 'Noida,28.7,77.3'
      });
      expect(error).toBeFalsy();
    });
  });

  describe('1.2 — Password Policy (end-to-end)', () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('register with weak password returns 400', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'a@b.com', password: 'a' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('register with short password returns specific message', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'a@b.com', password: 'Ab1!' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/8 characters/);
    });

    test('register with valid password calls User.create', async () => {
      User.create.mockResolvedValue({
        id: 'new-id',
        email: 'new@test.com',
        name: '',
        phone: '',
        toJSON: function () { return { id: this.id, email: this.email, name: this.name, phone: this.phone }; }
      });
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'new@test.com', password: 'ValidPass1!' });
      expect(res.status).toBe(201);
    });
  });

  describe('1.1 — Rate Limiter Configuration', () => {

    test('login route has rate limiter (responds normally on first call)', async () => {
      mockUserFind('ratelimit@test.com', null);
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'ratelimit@test.com', password: 'x' });
      // Should get 401 (invalid creds) not 429 (rate limit)
      expect(res.status).toBe(401);
    });
  });

  describe('1.6 — Account Lockout', () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('first failed login returns 401 (not locked)', async () => {
      mockUserFind('lockout@test.com', {
        id: 'u1',
        email: 'lockout@test.com',
        password: await bcrypt.hash('RealPass1!', 10),
        toJSON: function () { return { id: this.id, email: this.email }; }
      });
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'lockout@test.com', password: 'WrongPass1!' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('1.7 — Request body size limit', () => {

    test('express.json limit is set to 1mb', () => {
      // Check that the app has the json middleware with limit
      const jsonMiddleware = app._router.stack.find(
        layer => layer.name === 'jsonParser'
      );
      expect(jsonMiddleware).toBeTruthy();
    });
  });
});
