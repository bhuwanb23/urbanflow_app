const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const DataLoader = require('./utils/DataLoader');

// Import routes
const stopsRouter = require('./routes/stops');
const routesRouter = require('./routes/routes');
const scheduleRouter = require('./routes/schedule');
const shapesRouter = require('./routes/shapes');
const searchRouter = require('./routes/search');
const planRouter = require('./routes/plan');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize data loader
const dataLoader = new DataLoader();

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/v1/stops', stopsRouter);
app.use('/api/v1/routes', routesRouter);
app.use('/api/v1/schedule', scheduleRouter);
app.use('/api/v1/shapes', shapesRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/plan', planRouter);

// API information endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    name: 'UrbanFlow API',
    version: process.env.API_VERSION || 'v1',
    description: 'Multimodal Urban Transport System for Bengaluru',
    endpoints: {
      stops: '/api/v1/stops',
      routes: '/api/v1/routes',
      schedule: '/api/v1/schedule/:routeId',
      shapes: '/api/v1/shapes/:shapeId',
      search: '/api/v1/search?q=query',
      plan: '/api/v1/plan (POST)'
    }
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

// Start server
async function startServer() {
  try {
    // Load all GTFS data
    await dataLoader.loadAll();
    
    // Start listening
    app.listen(PORT, () => {
      logger.info(`🚀 UrbanFlow API server running on port ${PORT}`);
      logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🌍 Health check: http://localhost:${PORT}/health`);
      logger.info(`📊 API info: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
