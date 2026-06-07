/**
 * Trip route unit tests
 * Covers: CRUD, ownership enforcement, /stats aggregation
 */

jest.mock('express-rate-limit', () => () => (req, res, next) => next());

const request = require('supertest');
const { createTestApp, setupDatabase, truncateAll } = require('./helpers/db');
const { sequelize } = require('../../models');

let app;
let userToken;
let userId;

const validTrip = {
  from: { name: 'A', lat: 12.9, lon: 77.6 },
  to: { name: 'B', lat: 12.95, lon: 77.65 },
  mode: 'bus',
  distance: 5000,
  duration: 1200,
  carbonSaved: 1.2,
  cost: 25,
  caloriesBurned: 80
};

beforeAll(async () => {
  app = createTestApp(true, true);
  await setupDatabase(sequelize);
});

beforeEach(async () => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'tripper@example.com', password: 'Password1!', name: 'Tripper' });
  userToken = res.body.data.token;
  userId = res.body.data.user.id;
});

afterEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/v1/trips', () => {
  test('creates a trip with valid data', async () => {
    const res = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validTrip);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userId).toBe(userId);
    expect(res.body.data.mode).toBe('bus');
    expect(res.body.data.distance).toBe(5000);
  });

  test('rejects trip with missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ mode: 'bus' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('rejects trip with invalid lat/lon', async () => {
    const res = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...validTrip, from: { name: 'A', lat: 999, lon: 77.6 } });
    expect(res.status).toBe(400);
  });

  test('returns 401 without token', async () => {
    const res = await request(app).post('/api/v1/trips').send(validTrip);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/trips', () => {
  test('returns empty list when no trips', async () => {
    const res = await request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.trips).toEqual([]);
    expect(res.body.data.total).toBe(0);
  });

  test('returns user trips', async () => {
    await request(app).post('/api/v1/trips').set('Authorization', `Bearer ${userToken}`).send(validTrip);
    await request(app).post('/api/v1/trips').set('Authorization', `Bearer ${userToken}`).send({ ...validTrip, mode: 'metro' });
    const res = await request(app)
      .get('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(2);
    expect(res.body.data.trips.length).toBe(2);
  });

  test('rejects invalid limit', async () => {
    const res = await request(app)
      .get('/api/v1/trips?limit=abc')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/trips/stats', () => {
  test('returns aggregated stats', async () => {
    await request(app).post('/api/v1/trips').set('Authorization', `Bearer ${userToken}`).send(validTrip);
    const res = await request(app)
      .get('/api/v1/trips/stats')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalTrips).toBe(1);
    expect(res.body.data.totalDistance).toBe(5000);
    expect(res.body.data.totalCarbonSaved).toBe(1.2);
    expect(res.body.data.byMode.bus.count).toBe(1);
  });

  test('supports period=day filter', async () => {
    await request(app).post('/api/v1/trips').set('Authorization', `Bearer ${userToken}`).send(validTrip);
    const res = await request(app)
      .get('/api/v1/trips/stats?period=day')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.period).toBe('day');
    expect(res.body.data.totalTrips).toBe(1);
  });
});

describe('Ownership enforcement', () => {
  test('PUT /api/v1/trips/:id returns 403 for other user', async () => {
    const created = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validTrip);
    const tripId = created.body.data.id;

    // Register a second user
    const other = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'other@example.com', password: 'Password1!', name: 'Other' });
    const otherToken = other.body.data.token;

    const res = await request(app)
      .put(`/api/v1/trips/${tripId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ mode: 'metro' });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/not authorized/i);
  });

  test('DELETE /api/v1/trips/:id returns 403 for other user', async () => {
    const created = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validTrip);
    const tripId = created.body.data.id;

    const other = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'other2@example.com', password: 'Password1!', name: 'Other2' });
    const otherToken = other.body.data.token;

    const res = await request(app)
      .delete(`/api/v1/trips/${tripId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(403);
  });

  test('DELETE /api/v1/trips/:id succeeds for owner', async () => {
    const created = await request(app)
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validTrip);
    const tripId = created.body.data.id;

    const res = await request(app)
      .delete(`/api/v1/trips/${tripId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
