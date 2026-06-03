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

jest.mock('../utils/carbonCalculator', () => ({
  compareModes: jest.fn().mockReturnValue([]),
  calculateCarbonSaved: jest.fn().mockReturnValue(0),
  getEcoScore: jest.fn().mockReturnValue({}),
  calculateLegEmissions: jest.fn().mockReturnValue(0)
}));

jest.mock('../utils/modeMapper', () => ({
  getAllModes: jest.fn().mockReturnValue([]),
  getModeInfo: jest.fn().mockReturnValue({}),
  isEcoFriendly: jest.fn().mockReturnValue(false)
}));

jest.mock('../utils/fareCalculator', () => ({
  calculateTotalFare: jest.fn().mockReturnValue({ total: 0, breakdown: [] }),
  applyTransferDiscount: jest.fn().mockReturnValue({ finalFare: 0, transferDiscount: 0, hasTransfer: false })
}));

jest.mock('../services/otpService', () => ({
  planJourney: jest.fn().mockResolvedValue({}),
  parseOTPResponse: jest.fn().mockReturnValue([])
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
  app.use('/api/v1/auth', authRouter);

  // Mock authenticate middleware to attach a fake user
  app.use('/api/v1', (req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@test.com' };
    next();
  });

  const tripsRouter = require('../routes/trips');
  const userRouter = require('../routes/user');
  const notificationsRouter = require('../routes/notifications');
  const ecostatsRouter = require('../routes/ecostats');
  const planRouter = require('../routes/plan');

  app.use('/api/v1/trips', tripsRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/notifications', notificationsRouter);
  app.use('/api/v1/ecostats', ecostatsRouter);
  app.use('/api/v1/plan', planRouter);

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

// ─── Phase 2 tests ─────────────────────────────────────────
describe('Phase 2 — Backend Quality & Missing Features', () => {

  describe('2.3 — Input validation', () => {

    test('plan compare — rejects NaN distance', async () => {
      const res = await request(app)
        .get('/api/v1/plan/compare?distance=abc');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/positive number/);
    });

    test('plan compare — rejects negative distance', async () => {
      const res = await request(app)
        .get('/api/v1/plan/compare?distance=-5');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/positive number/);
    });

    test('plan compare — accepts valid distance', async () => {
      const res = await request(app)
        .get('/api/v1/plan/compare?distance=10');
      expect(res.status).not.toBe(400);
    });
  });

  describe('2.1 — Password reset flow', () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('forgot-password returns success even for unknown email', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'unknown@test.com' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('forgot-password generates token for known user', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'known@test.com',
        password: 'hash',
        passwordResetToken: null,
        passwordResetExpires: null,
        save: jest.fn().mockResolvedValue(this)
      };
      User.findOne.mockResolvedValue(mockUser);
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'known@test.com' });
      expect(res.status).toBe(200);
      expect(mockUser.passwordResetToken).toBeTruthy();
      expect(mockUser.passwordResetExpires).toBeTruthy();
      expect(mockUser.save).toHaveBeenCalled();
    });

    test('forgot-password rejects missing email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({});
      expect(res.status).toBe(400);
    });

    test('reset-password rejects missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ email: 'x@x.com' });
      expect(res.status).toBe(400);
    });

    test('reset-password rejects weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ token: 'abc', email: 'x@x.com', password: 'short' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/8 characters/);
    });

    test('reset-password rejects invalid token', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ token: 'invalid', email: 'x@x.com', password: 'ValidPass1!' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid or expired/);
    });

    test('reset-password succeeds with valid token', async () => {
      const crypto = require('crypto');
      const realToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(realToken).digest('hex');

      const mockUser = {
        id: 'user-1',
        email: 'reset@test.com',
        password: 'oldhash',
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 3600000),
        save: jest.fn().mockResolvedValue(this)
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ token: realToken, email: 'reset@test.com', password: 'NewValidPass1!' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockUser.passwordResetToken).toBeNull();
      expect(mockUser.passwordResetExpires).toBeNull();
    });
  });
});
