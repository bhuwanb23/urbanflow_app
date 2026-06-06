/**
 * Auth route unit tests
 * Covers: register, login, verify, refresh, forgot/reset password
 */

// Disable rate limiting in tests (express-rate-limit persists in-memory across tests)
jest.mock('express-rate-limit', () => () => (req, res, next) => next());

const request = require('supertest');
const { createTestApp, setupDatabase, truncateAll } = require('./helpers/db');
const { sequelize } = require('../../models');

let app;

beforeAll(async () => {
  app = createTestApp(true, false);
  await setupDatabase(sequelize);
});

afterEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await sequelize.close();
});

const validUser = {
  email: 'test@example.com',
  password: 'Password1!',
  name: 'Test User',
  phone: '+1234567890'
};

// ─── Registration ─────────────────────────────────────────
describe('POST /api/v1/auth/register', () => {
  test('registers a new user with valid data', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.name).toBe(validUser.name);
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  test('rejects registration with weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'weak@example.com', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('rejects registration with invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'Password1!' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('rejects duplicate email registration', async () => {
    await request(app).post('/api/v1/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validUser);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });
});

// ─── Login ────────────────────────────────────────────────
describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(validUser);
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  test('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: validUser.email, password: 'WrongPass1!' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid credentials');
  });

  test('rejects login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password1!' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});

// ─── Token verify ─────────────────────────────────────────
describe('POST /api/v1/auth/verify', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/v1/auth/register').send(validUser);
    token = res.body.data.token;
  });

  test('verifies a valid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(validUser.email);
  });

  test('rejects request without token', async () => {
    const res = await request(app).post('/api/v1/auth/verify');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/no token/i);
  });

  test('rejects invalid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });
});

// ─── Token refresh ────────────────────────────────────────
describe('POST /api/v1/auth/refresh', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/v1/auth/register').send(validUser);
    token = res.body.data.token;
  });

  test('refreshes a valid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data.token.split('.').length).toBe(3);
  });

  test('rejects refresh without token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh');
    expect(res.status).toBe(401);
  });
});
