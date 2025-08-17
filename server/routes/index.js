const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./user');
const tripRoutes = require('./trips');
const routeRoutes = require('./routes');
const ecoStatsRoutes = require('./ecostats');
const notificationRoutes = require('./notifications');
const trafficRoutes = require('./traffic');
const healthRoutes = require('./health');

// API version prefix
const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check route (no authentication required)
router.use('/health', healthRoutes);

// API routes with versioning
router.use(`${API_PREFIX}/${API_VERSION}/auth`, authRoutes);
router.use(`${API_PREFIX}/${API_VERSION}/user`, userRoutes);
router.use(`${API_PREFIX}/${API_VERSION}/trips`, tripRoutes);
router.use(`${API_PREFIX}/${API_VERSION}/routes`, routeRoutes);
router.use(`${API_PREFIX}/${API_VERSION}/ecostats`, ecoStatsRoutes);
router.use(`${API_PREFIX}/${API_VERSION}/notifications`, notificationRoutes);
router.use(`${API_PREFIX}/${API_VERSION}/traffic`, trafficRoutes);

// Root API endpoint
router.get(`${API_PREFIX}/${API_VERSION}`, (req, res) => {
  res.json({
    message: 'UrbanFlow API',
    version: API_VERSION,
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: `${API_PREFIX}/${API_VERSION}/auth`,
      user: `${API_PREFIX}/${API_VERSION}/user`,
      trips: `${API_PREFIX}/${API_VERSION}/trips`,
      routes: `${API_PREFIX}/${API_VERSION}/routes`,
      ecoStats: `${API_PREFIX}/${API_VERSION}/ecostats`,
      notifications: `${API_PREFIX}/${API_VERSION}/notifications`,
      traffic: `${API_PREFIX}/${API_VERSION}/traffic`,
      health: '/health'
    }
  });
});

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: [
      `${API_PREFIX}/${API_VERSION}/auth`,
      `${API_PREFIX}/${API_VERSION}/user`,
      `${API_PREFIX}/${API_VERSION}/trips`,
      `${API_PREFIX}/${API_VERSION}/routes`,
      `${API_PREFIX}/${API_VERSION}/ecostats`,
      `${API_PREFIX}/${API_VERSION}/notifications`,
      `${API_PREFIX}/${API_VERSION}/traffic`,
      '/health'
    ]
  });
});

module.exports = router;
