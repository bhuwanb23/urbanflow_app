const request = require('supertest');
const express = require('express');

jest.mock('express-rate-limit', () => () => (req, res, next) => next());

const citiesRouter = require('../../routes/cities');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/cities', citiesRouter);
  return app;
}

let app;

beforeAll(() => {
  app = createApp();
});

describe('GET /api/v1/cities', () => {
  test('returns all registered cities with data status', async () => {
    const res = await request(app).get('/api/v1/cities');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalCities).toBe(3);
    expect(res.body.data.cities).toHaveLength(3);

    const ids = res.body.data.cities.map(c => c.id);
    expect(ids).toContain('delhi');
    expect(ids).toContain('bangalore');
    expect(ids).toContain('chennai');

    // Each city should have a hasData flag
    for (const city of res.body.data.cities) {
      expect(city).toHaveProperty('hasData');
    }
  });
});

describe('GET /api/v1/cities/:cityId', () => {
  test('returns specific city with data status', async () => {
    const res = await request(app).get('/api/v1/cities/bangalore');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.displayName).toBe('Bengaluru');
    expect(res.body.data).toHaveProperty('dataStatus');
  });

  test('returns 404 for unknown city', async () => {
    const res = await request(app).get('/api/v1/cities/atlantis');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });
});

describe('POST /api/v1/cities/switch', () => {
  test('switches to a valid city', async () => {
    const res = await request(app).post('/api/v1/cities/switch').send({ cityId: 'chennai' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentCity.displayName).toBe('Chennai');
  });

  test('returns 400 when cityId is missing', async () => {
    const res = await request(app).post('/api/v1/cities/switch').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('cityId is required');
  });

  test('returns 400 for unregistered city', async () => {
    const res = await request(app).post('/api/v1/cities/switch').send({ cityId: 'atlantis' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("not registered");
  });
});

describe('GET /api/v1/cities/current/info', () => {
  test('returns current active city', async () => {
    const res = await request(app).get('/api/v1/cities/current/info');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('displayName');
  });
});
