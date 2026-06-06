/**
 * User route unit tests
 * Covers: profile GET/PUT, preferences GET/PUT, unauthorized access
 */

jest.mock('express-rate-limit', () => () => (req, res, next) => next());

const request = require('supertest');
const { createTestApp, setupDatabase, truncateAll } = require('./helpers/db');
const { sequelize, User } = require('../../models');

let app;
let token;
let userId;

beforeAll(async () => {
  app = createTestApp(true, true);
  await setupDatabase(sequelize);
});

beforeEach(async () => {
  // register a user and grab token
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'user@example.com', password: 'Password1!', name: 'User' });
  token = res.body.data.token;
  userId = res.body.data.user.id;
});

afterEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/v1/user/profile', () => {
  test('returns the authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/v1/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('user@example.com');
    expect(res.body.data.name).toBe('User');
    expect(res.body.data).not.toHaveProperty('password');
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/user/profile');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/v1/user/profile', () => {
  test('updates name and phone', async () => {
    const res = await request(app)
      .put('/api/v1/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', phone: '+999' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
    expect(res.body.data.phone).toBe('+999');
  });

  test('merges preferences without overwriting other fields', async () => {
    const res = await request(app)
      .put('/api/v1/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ preferences: { language: 'en', notificationsEnabled: true } });
    expect(res.status).toBe(200);
    expect(res.body.data.preferences.language).toBe('en');
    expect(res.body.data.preferences.notificationsEnabled).toBe(true);
    // name should still be 'User' (the original)
    expect(res.body.data.name).toBe('User');
  });

  test('returns 401 without token', async () => {
    const res = await request(app)
      .put('/api/v1/user/profile')
      .send({ name: 'Hacker' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/user/preferences', () => {
  test('returns the user preferences', async () => {
    const res = await request(app)
      .get('/api/v1/user/preferences')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data).toBe('object');
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/user/preferences');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/v1/user/preferences', () => {
  test('updates preferences', async () => {
    const res = await request(app)
      .put('/api/v1/user/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ notifications: true, language: 'en' });
    expect(res.status).toBe(200);
    expect(res.body.data.notifications).toBe(true);
    expect(res.body.data.language).toBe('en');
  });

  test('returns 401 without token', async () => {
    const res = await request(app)
      .put('/api/v1/user/preferences')
      .send({ theme: 'dark' });
    expect(res.status).toBe(401);
  });
});
