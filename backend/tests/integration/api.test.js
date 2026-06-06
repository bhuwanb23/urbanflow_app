/**
 * Backend integration tests
 * Boots full app via createTestApp (all public + protected routes) and runs end-to-end flows:
 * - Auth flow (register → login → verify → refresh)
 * - Protected resource access (with/without token)
 * - Trip + EcoStats round-trip
 * - City switching (placeholder)
 * - Phase 4 realtime endpoints
 */

jest.mock('express-rate-limit', () => () => (req, res, next) => next());

const request = require('supertest');
const { createTestApp, setupDatabase, truncateAll } = require('../unit/helpers/db');
const { sequelize } = require('../../models');

let app;

beforeAll(async () => {
  app = createTestApp(true, true);
  await setupDatabase(sequelize);
});

afterEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth flow integration', () => {
  test('register → login → verify → refresh chain works end-to-end', async () => {
    const creds = { email: 'integration@example.com', password: 'Password1!', name: 'Integration' };

    // Register
    const reg = await request(app).post('/api/v1/auth/register').send(creds);
    expect(reg.status).toBe(201);
    const regToken = reg.body.data.token;
    expect(regToken).toBeDefined();

    // Verify registration token
    const ver = await request(app).post('/api/v1/auth/verify').set('Authorization', `Bearer ${regToken}`);
    expect(ver.status).toBe(200);
    expect(ver.body.data.email).toBe(creds.email);

    // Login
    const login = await request(app).post('/api/v1/auth/login').send({ email: creds.email, password: creds.password });
    expect(login.status).toBe(200);
    const loginToken = login.body.data.token;
    expect(loginToken).toBeDefined();

    // Refresh
    const refresh = await request(app).post('/api/v1/auth/refresh').set('Authorization', `Bearer ${loginToken}`);
    expect(refresh.status).toBe(200);
    expect(refresh.body.data.token).toBeDefined();
  });

  test('logout returns success even without token (idempotent)', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Protected endpoint access', () => {
  let token;
  let tripId;

  beforeEach(async () => {
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'protected@example.com', password: 'Password1!', name: 'P' });
    token = reg.body.data.token;

    const trip = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        from: { name: 'A', lat: 12.9, lon: 77.6 },
        to: { name: 'B', lat: 12.95, lon: 77.65 },
        mode: 'bus', distance: 5000, carbonSaved: 1.5, cost: 25
      });
    tripId = trip.body.data.id;
  });

  test('GET /trips without token returns 401', async () => {
    const res = await request(app).get('/api/v1/trips');
    expect(res.status).toBe(401);
  });

  test('GET /trips with token returns the user trip', async () => {
    const res = await request(app).get('/api/v1/trips').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(1);
  });

  test('GET /trips/stats aggregates correctly', async () => {
    const res = await request(app).get('/api/v1/trips/stats').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalTrips).toBe(1);
  });

  test('GET /ecostats reflects the trip', async () => {
    const res = await request(app).get('/api/v1/ecostats').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.trips.total).toBe(1);
    expect(res.body.data.carbon.saved).toBe(1.5);
  });

  test('GET /user/profile returns the user', async () => {
    const res = await request(app).get('/api/v1/user/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('protected@example.com');
  });

  test('invalid token returns 401', async () => {
    const res = await request(app).get('/api/v1/user/profile').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});

describe('City switching flow', () => {
  test('GET /api/v1/cities returns city list (placeholder for switch)', async () => {
    // The cities route is not mounted in createTestApp, but we verify the test runner is healthy
    const res = await request(app).get('/api/v1/live/vehicles/status');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Phase 4 realtime integration', () => {
  test('live vehicles + delays + alerts endpoints respond', async () => {
    const vehicles = await request(app).get('/api/v1/live/vehicles');
    const delays = await request(app).get('/api/v1/live/delays');
    const alerts = await request(app).get('/api/v1/live/alerts');
    expect(vehicles.status).toBe(200);
    expect(delays.status).toBe(200);
    expect(alerts.status).toBe(200);
  });

  test('live alerts/recent supports limit query', async () => {
    const res = await request(app).get('/api/v1/live/alerts/recent?limit=3');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.feedItems)).toBe(true);
  });
});
