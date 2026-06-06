/**
 * EcoStats route unit tests
 * Covers: period filtering, CO2 aggregation, achievement computation, summary
 */

jest.mock('express-rate-limit', () => () => (req, res, next) => next());

const request = require('supertest');
const { createTestApp, setupDatabase, truncateAll } = require('./helpers/db');
const { sequelize } = require('../../models');

let app;
let token;
let userId;

const validTrip = (overrides = {}) => ({
  from: { name: 'A', lat: 12.9, lon: 77.6 },
  to: { name: 'B', lat: 12.95, lon: 77.65 },
  mode: 'bus',
  distance: 5000,
  duration: 1200,
  carbonSaved: 1.5,
  cost: 25,
  caloriesBurned: 80,
  ...overrides
});

beforeAll(async () => {
  app = createTestApp(true, true);
  await setupDatabase(sequelize);
});

beforeEach(async () => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'eco@example.com', password: 'Password1!', name: 'Eco' });
  token = res.body.data.token;
  userId = res.body.data.user.id;
});

afterEach(async () => {
  await truncateAll();
});

afterAll(async () => {
  await sequelize.close();
});

async function createTrip(trip) {
  return request(app).post('/api/v1/trips').set('Authorization', `Bearer ${token}`).send(trip);
}

describe('GET /api/v1/ecostats', () => {
  test('returns zero stats with no trips', async () => {
    const res = await request(app)
      .get('/api/v1/ecostats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.trips.total).toBe(0);
    expect(res.body.data.carbon.saved).toBe(0);
    expect(res.body.data.distance.total).toBe(0);
  });

  test('aggregates trips for the default period (week)', async () => {
    await createTrip(validTrip());
    await createTrip(validTrip({ mode: 'metro', carbonSaved: 0.5 }));
    const res = await request(app)
      .get('/api/v1/ecostats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.trips.total).toBe(2);
    expect(res.body.data.trips.byMode.bus).toBe(1);
    expect(res.body.data.trips.byMode.metro).toBe(1);
    expect(res.body.data.carbon.saved).toBe(2.0);
    expect(res.body.data.distance.total).toBe(10000);  // 5000m * 2 = 10000m
  });

  test('respects period=day query parameter', async () => {
    await createTrip(validTrip());
    const res = await request(app)
      .get('/api/v1/ecostats?period=day')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.period).toBe('day');
    expect(res.body.data.trips.total).toBe(1);
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/ecostats');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/ecostats/weekly', () => {
  test('always uses week period', async () => {
    await createTrip(validTrip());
    const res = await request(app)
      .get('/api/v1/ecostats/weekly')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.period).toBe('week');
    expect(res.body.data.trips.total).toBe(1);
  });
});

describe('GET /api/v1/ecostats/monthly', () => {
  test('always uses month period', async () => {
    await createTrip(validTrip());
    const res = await request(app)
      .get('/api/v1/ecostats/monthly')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.period).toBe('month');
  });
});

describe('GET /api/v1/ecostats/achievements', () => {
  test('returns locked achievements with zero progress', async () => {
    const res = await request(app)
      .get('/api/v1/ecostats/achievements')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.achievements.length).toBe(6);
    expect(res.body.data.summary.unlocked).toBe(0);
    expect(res.body.data.summary.total).toBe(6);
  });

  test('unlocks achievements when targets are met', async () => {
    // 10 bus trips in a week = ach-001 (Green Commuter)
    for (let i = 0; i < 10; i++) {
      await createTrip(validTrip({ mode: 'bus' }));
    }
    const res = await request(app)
      .get('/api/v1/ecostats/achievements')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const greenCommuter = res.body.data.achievements.find(a => a.id === 'ach-001');
    expect(greenCommuter.unlocked).toBe(true);
    expect(greenCommuter.progress).toBe(100);
  });
});

describe('GET /api/v1/ecostats/summary', () => {
  test('returns the summary fields', async () => {
    await createTrip(validTrip());
    const res = await request(app)
      .get('/api/v1/ecostats/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('carbonSaved');
    expect(res.body.data).toHaveProperty('tripsCompleted');
    expect(res.body.data).toHaveProperty('distanceCovered');
    expect(res.body.data).toHaveProperty('achievementsUnlocked');
    expect(res.body.data.tripsCompleted).toBe(1);
    expect(res.body.data.carbonSaved).toBe(1.5);
  });
});
