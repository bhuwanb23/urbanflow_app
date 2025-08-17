const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./user');
const tripsRoutes = require('./trips');
const routesRoutes = require('./routes');
const ecostatsRoutes = require('./ecostats');
const trafficRoutes = require('./traffic');
const notificationsRoutes = require('./notifications');
const healthRoutes = require('./health');

// API version prefix
const API_VERSION = process.env.API_VERSION || 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// Health check route (no version prefix)
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'UrbanFlow API is running',
    version: API_VERSION,
    timestamp: new Date().toISOString()
  });
});

// API information route
router.get(API_PREFIX, (req, res) => {
  res.json({
    name: 'UrbanFlow API',
    version: API_VERSION,
    description: 'Backend API for UrbanFlow mobile app',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      user: `${API_PREFIX}/user`,
      trips: `${API_PREFIX}/trips`,
      routes: `${API_PREFIX}/routes`,
      ecostats: `${API_PREFIX}/ecostats`,
      traffic: `${API_PREFIX}/traffic`,
      notifications: `${API_PREFIX}/notifications`
    },
    documentation: '/api/docs',
    health: '/health'
  });
});

// Mount route modules with version prefix
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/user`, userRoutes);
router.use(`${API_PREFIX}/trips`, tripsRoutes);
router.use(`${API_PREFIX}/routes`, routesRoutes);
router.use(`${API_PREFIX}/ecostats`, ecostatsRoutes);
router.use(`${API_PREFIX}/traffic`, trafficRoutes);
router.use(`${API_PREFIX}/notifications`, notificationsRoutes);

// Health routes (with version prefix)
router.use(`${API_PREFIX}/health`, healthRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      `${API_PREFIX}/auth`,
      `${API_PREFIX}/user`,
      `${API_PREFIX}/trips`,
      `${API_PREFIX}/routes`,
      `${API_PREFIX}/ecostats`,
      `${API_PREFIX}/traffic`,
      `${API_PREFIX}/notifications`,
      `${API_PREFIX}/health`
    ]
  });
});

module.exports = router;
