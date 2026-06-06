/**
 * Phase 4 Backend Realtime Endpoint Tests
 * Tests all GTFS-RT endpoints via supertest (in-process, no real server needed)
 *
 * Converted from tests/test-phase4.js (manual axios + process.exit)
 * - Uses supertest for in-process testing
 * - Wraps scenarios in describe/test (Jest format)
 * - No process.exit() — Jest handles exit codes
 */

const request = require('supertest');
const express = require('express');

// ─── Build minimal test app (live realtime routes only) ───
function createLiveTestApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const liveVehiclesRouter = require('../routes/liveVehicles');
  const liveDelaysRouter = require('../routes/liveDelays');
  const liveAlertsRouter = require('../routes/liveAlerts');
  const livePredictionsRouter = require('../routes/livePredictions');

  app.use('/api/v1/live/vehicles', liveVehiclesRouter);
  app.use('/api/v1/live/delays', liveDelaysRouter);
  app.use('/api/v1/live/alerts', liveAlertsRouter);
  app.use('/api/v1/live/predictions', livePredictionsRouter);

  app.get('/api/v1', (req, res) => {
    res.json({
      success: true,
      name: 'UrbanFlow API',
      version: 'v1',
      endpoints: {
        auth: '/api/v1/auth',
        user: '/api/v1/user',
        trips: '/api/v1/trips',
        notifications: '/api/v1/notifications',
        'live/vehicles': '/api/v1/live/vehicles',
        'live/delays': '/api/v1/live/delays',
        'live/alerts': '/api/v1/live/alerts',
        'live/predictions': '/api/v1/live/predictions'
      }
    });
  });

  return app;
}

const app = createLiveTestApp();

// ─── Helpers ───────────────────────────────────────────────
async function expectSuccess(res, expectedKeys = []) {
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('success', true);
  expect(res.body).toHaveProperty('data');
  for (const key of expectedKeys) {
    expect(res.body.data).toHaveProperty(key);
  }
}

// ─── Live Vehicles ─────────────────────────────────────────
describe('Phase 4 — Live Vehicles', () => {
  test('GET /api/v1/live/vehicles — returns all active vehicles', async () => {
    const res = await request(app).get('/api/v1/live/vehicles');
    expectSuccess(res, ['vehicles', 'total', 'lastUpdated']);
    expect(Array.isArray(res.body.data.vehicles)).toBe(true);
    expect(typeof res.body.data.total).toBe('number');
  });

  test('GET /api/v1/live/vehicles/route/:routeId — returns vehicles for a route', async () => {
    const res = await request(app).get('/api/v1/live/vehicles/route/500A');
    expectSuccess(res, ['vehicles', 'routeId', 'total']);
    expect(res.body.data.routeId).toBe('500A');
  });

  test('GET /api/v1/live/vehicles/status — returns service status', async () => {
    const res = await request(app).get('/api/v1/live/vehicles/status');
    expectSuccess(res);
    expect(res.body.data).toBeDefined();
  });
});

// ─── Live Delays ───────────────────────────────────────────
describe('Phase 4 — Live Delays', () => {
  test('GET /api/v1/live/delays — returns all trip delay predictions', async () => {
    const res = await request(app).get('/api/v1/live/delays');
    expectSuccess(res, ['delays', 'total', 'lastUpdated']);
    expect(Array.isArray(res.body.data.delays)).toBe(true);
  });

  test('GET /api/v1/live/delays/route/:routeId — returns delays for a route', async () => {
    const res = await request(app).get('/api/v1/live/delays/route/500A');
    expectSuccess(res, ['delays', 'routeId', 'averageDelay', 'total']);
    expect(res.body.data.routeId).toBe('500A');
  });

  test('GET /api/v1/live/delays/severe — returns severely delayed trips', async () => {
    const res = await request(app).get('/api/v1/live/delays/severe');
    expectSuccess(res, ['severeDelays', 'total']);
    expect(Array.isArray(res.body.data.severeDelays)).toBe(true);
  });
});

// ─── Live Alerts ───────────────────────────────────────────
describe('Phase 4 — Live Alerts', () => {
  test('GET /api/v1/live/alerts — returns all active service alerts', async () => {
    const res = await request(app).get('/api/v1/live/alerts');
    expectSuccess(res, ['alerts', 'total', 'lastUpdated']);
    expect(Array.isArray(res.body.data.alerts)).toBe(true);
  });

  test('GET /api/v1/live/alerts/critical — returns critical alerts only', async () => {
    const res = await request(app).get('/api/v1/live/alerts/critical');
    expectSuccess(res, ['alerts', 'total']);
    expect(Array.isArray(res.body.data.alerts)).toBe(true);
  });

  test('GET /api/v1/live/alerts/recent?limit=5 — returns recent feed items', async () => {
    const res = await request(app).get('/api/v1/live/alerts/recent?limit=5');
    expectSuccess(res, ['feedItems', 'total']);
    expect(Array.isArray(res.body.data.feedItems)).toBe(true);
  });
});

// ─── API Info ──────────────────────────────────────────────
describe('Phase 4 — API Info Endpoint', () => {
  test('GET /api/v1 — returns API metadata', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('endpoints');
    expect(res.body.endpoints).toHaveProperty('auth');
    expect(res.body.endpoints).toHaveProperty('live/vehicles');
    expect(res.body.endpoints).toHaveProperty('live/delays');
    expect(res.body.endpoints).toHaveProperty('live/alerts');
  });
});
