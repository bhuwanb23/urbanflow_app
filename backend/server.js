const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const DataLoader = require('./utils/DataLoader');
const cityManager = require('./utils/cityManager');
const { initializeDatabase } = require('./models');
const { authenticate } = require('./middleware/auth');

// Import routes
const stopsRouter = require('./routes/stops');
const routesRouter = require('./routes/routes');
const scheduleRouter = require('./routes/schedule');
const shapesRouter = require('./routes/shapes');
const searchRouter = require('./routes/search');
const planRouter = require('./routes/plan');
const citiesRouter = require('./routes/cities');
const environmentRouter = require('./routes/environment');
const trafficRouter = require('./routes/traffic');
const ecostatsRouter = require('./routes/ecostats');
const userRouter = require('./routes/user');
const tripsRouter = require('./routes/trips');
const notificationsRouter = require('./routes/notifications');
const authRouter = require('./routes/auth');

// Import Phase 4 realtime routes
const liveVehiclesRouter = require('./routes/liveVehicles');
const liveDelaysRouter = require('./routes/liveDelays');
const liveAlertsRouter = require('./routes/liveAlerts');
const livePredictionsRouter = require('./routes/livePredictions');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize data loader and register with city manager
const dataLoader = new DataLoader();
cityManager.setDataLoader(dataLoader);

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Compression middleware
app.use(compression());

// Make dataLoader available to all routes
app.use((req, res, next) => {
  req.dataLoader = dataLoader;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API stats endpoint
app.get('/api/stats', (req, res) => {
  const summary = dataLoader.getSummary();
  res.json({
    success: true,
    data: {
      version: process.env.API_VERSION || 'v1',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      data: summary
    }
  });
});

// Mount routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', authenticate, userRouter);
app.use('/api/v1/trips', authenticate, tripsRouter);
app.use('/api/v1/notifications', authenticate, notificationsRouter);
app.use('/api/v1/stops', stopsRouter);
app.use('/api/v1/routes', routesRouter);
app.use('/api/v1/schedule', scheduleRouter);
app.use('/api/v1/shapes', shapesRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/plan', planRouter);
app.use('/api/v1/cities', citiesRouter);
app.use('/api/v1/environment', environmentRouter);
app.use('/api/v1/traffic', trafficRouter);
app.use('/api/v1/ecostats', authenticate, ecostatsRouter);

// Mount Phase 4 realtime routes
app.use('/api/v1/live/vehicles', liveVehiclesRouter);
app.use('/api/v1/live/delays', liveDelaysRouter);
app.use('/api/v1/live/alerts', liveAlertsRouter);
app.use('/api/v1/live/predictions', livePredictionsRouter);

// API information endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    name: 'UrbanFlow API',
    version: process.env.API_VERSION || 'v1',
    description: 'Multimodal Urban Transport System for Bengaluru',
    endpoints: {
      // Authentication
      auth: {
        register: '/api/v1/auth/register (POST)',
        login: '/api/v1/auth/login (POST)',
        verify: '/api/v1/auth/verify (POST)',
        logout: '/api/v1/auth/logout (POST)',
        refresh: '/api/v1/auth/refresh (POST)'
      },
      // User Profile
      user: {
        profile: '/api/v1/user/profile',
        preferences: '/api/v1/user/preferences'
      },
      // Trips
      trips: {
        list: '/api/v1/trips',
        details: '/api/v1/trips/:id',
        stats: '/api/v1/trips/stats',
        create: '/api/v1/trips (POST)',
        delete: '/api/v1/trips/:id (DELETE)'
      },
      // Notifications
      notifications: {
        list: '/api/v1/notifications',
        details: '/api/v1/notifications/:id',
        markRead: '/api/v1/notifications/:id/read (PUT)',
        markAllRead: '/api/v1/notifications/read-all (PUT)',
        settings: '/api/v1/notifications/settings'
      },
      // Core Transit Data
      stops: '/api/v1/stops',
      routes: '/api/v1/routes',
      schedule: '/api/v1/schedule/:routeId',
      shapes: '/api/v1/shapes/:shapeId',
      search: '/api/v1/search?q=query',
      plan: '/api/v1/plan (POST)',
      cities: '/api/v1/cities',
      environment: '/api/v1/environment/aqi',
      traffic: '/api/v1/traffic',
      ecostats: '/api/v1/ecostats',
      // Phase 4 realtime endpoints
      'live/vehicles': '/api/v1/live/vehicles',
      'live/delays': '/api/v1/live/delays',
      'live/alerts': '/api/v1/live/alerts',
      'live/predictions': '/api/v1/live/predictions'
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Validate required environment variables
function validateEnv() {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  const defaultSecret = 'urbanflow-secret-key-change-in-production';
  if (process.env.JWT_SECRET === defaultSecret) {
    logger.error('JWT_SECRET is still set to the default value. Generate a strong random secret.');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    const corsOrigin = process.env.CORS_ORIGIN;
    if (!corsOrigin || corsOrigin === '*') {
      logger.error('CORS_ORIGIN must be set to an explicit origin in production (e.g. https://app.urbanflow.com)');
      process.exit(1);
    }
  }
}

// Start server
async function startServer() {
  try {
    // Validate environment
    validateEnv();

    // Initialize database
    await initializeDatabase();

    // Load all GTFS data
    await dataLoader.loadAll();

    // Start listening (HTTPS if certs provided, HTTP otherwise)
    const sslCertPath = process.env.SSL_CERT_PATH;
    const sslKeyPath = process.env.SSL_KEY_PATH;
    let server;
    if (sslCertPath && sslKeyPath) {
      const credentials = {
        cert: fs.readFileSync(sslCertPath),
        key: fs.readFileSync(sslKeyPath)
      };
      server = https.createServer(credentials, app);
      server.listen(PORT, () => {
        logger.info(`UrbanFlow API server running on HTTPS on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`Health check: https://localhost:${PORT}/health`);
        logger.info(`API info: https://localhost:${PORT}/api/v1`);
      });
    } else {
      server = app.listen(PORT, () => {
        logger.info(`UrbanFlow API server running on HTTP on port ${PORT}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`Health check: http://localhost:${PORT}/health`);
        logger.info(`API info: http://localhost:${PORT}/api/v1`);
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
