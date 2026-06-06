/**
 * Test helper: build an isolated test app with in-memory sqlite.
 *
 * Usage:
 *   const { app, sequelize } = createTestApp();
 *   beforeAll(async () => { await sequelize.sync({ force: true }); });
 *   afterEach(async () => { /* truncate tables *\/ });
 *   afterAll(async () => { await sequelize.close(); });
 */

const express = require('express');

function createTestApp(mountPublic = true, mountProtected = true) {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const authRouter = require('../../../routes/auth');
  const { authenticate } = require('../../../middleware/auth');
  const userRouter = require('../../../routes/user');
  const tripsRouter = require('../../../routes/trips');
  const notificationsRouter = require('../../../routes/notifications');
  const ecostatsRouter = require('../../../routes/ecostats');
  const planRouter = require('../../../routes/plan');
  const liveVehiclesRouter = require('../../../routes/liveVehicles');
  const liveDelaysRouter = require('../../../routes/liveDelays');
  const liveAlertsRouter = require('../../../routes/liveAlerts');
  const livePredictionsRouter = require('../../../routes/livePredictions');

  if (mountPublic) {
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/plan', planRouter);
    app.use('/api/v1/live/vehicles', liveVehiclesRouter);
    app.use('/api/v1/live/delays', liveDelaysRouter);
    app.use('/api/v1/live/alerts', liveAlertsRouter);
    app.use('/api/v1/live/predictions', livePredictionsRouter);
  }
  if (mountProtected) {
    app.use('/api/v1/user', authenticate, userRouter);
    app.use('/api/v1/trips', authenticate, tripsRouter);
    app.use('/api/v1/notifications', authenticate, notificationsRouter);
    app.use('/api/v1/ecostats', authenticate, ecostatsRouter);
  }

  return app;
}

async function setupDatabase(sequelize) {
  await sequelize.sync({ force: true });
}

async function truncateAll() {
  // sqlite has no TRUNCATE; delete all rows from each model table
  const models = require('../../../models');
  const tableNames = ['Notification', 'EcoStat', 'Trip', 'User'];
  for (const name of tableNames) {
    if (models[name]) {
      await models[name].destroy({ where: {} });
    }
  }
}

module.exports = { createTestApp, setupDatabase, truncateAll };
