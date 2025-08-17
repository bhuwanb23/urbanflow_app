const express = require('express');
const router = express.Router();
const { checkDBHealth, getDatabaseType } = require('../config/database');
const os = require('os');

// Helper function to get system information
const getSystemInfo = () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    systemUptime: os.uptime(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    loadAverage: os.loadavg(),
    cpus: os.cpus().length
  };
};

// Helper function to get application information
const getAppInfo = () => {
  return {
    name: process.env.npm_package_name || 'urbanflow-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

// @route   GET /health
// @desc    Basic health check
// @access  Public
router.get('/', async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };

    res.json({
      success: true,
      message: 'UrbanFlow Backend is running',
      data: healthData
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
});

// @route   GET /health/detailed
// @desc    Detailed health check with system info
// @access  Public
router.get('/detailed', async (req, res) => {
  try {
    const [dbHealth] = await Promise.all([
      checkDBHealth()
    ]);

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: dbHealth,
      system: getSystemInfo(),
      application: getAppInfo()
    };

    // Determine overall health status
    const isHealthy = dbHealth.isHealthy;
    healthData.status = isHealthy ? 'healthy' : 'unhealthy';

    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json({
      success: isHealthy,
      message: isHealthy ? 'All systems operational' : 'Some systems are experiencing issues',
      data: healthData
    });
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error',
      data: {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      }
    });
  }
});

// @route   GET /health/database
// @desc    Database health check
// @access  Public
router.get('/database', async (req, res) => {
  try {
    const dbHealth = await checkDBHealth();
    
    const statusCode = dbHealth.isHealthy ? 200 : 503;
    res.status(statusCode).json({
      success: dbHealth.isHealthy,
      message: dbHealth.isHealthy ? 'Database is healthy' : 'Database is experiencing issues',
      data: dbHealth
    });
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Database health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error',
      data: {
        status: 'error',
        timestamp: new Date().toISOString(),
        type: getDatabaseType()
      }
    });
  }
});

// @route   GET /health/system
// @desc    System information
// @access  Public
router.get('/system', (req, res) => {
  try {
    const systemInfo = getSystemInfo();
    
    res.json({
      success: true,
      message: 'System information retrieved successfully',
      data: systemInfo
    });
  } catch (error) {
    console.error('System info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system information',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
});

// @route   GET /health/application
// @desc    Application information
// @access  Public
router.get('/application', (req, res) => {
  try {
    const appInfo = getAppInfo();
    
    res.json({
      success: true,
      message: 'Application information retrieved successfully',
      data: appInfo
    });
  } catch (error) {
    console.error('Application info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve application information',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
});

// @route   GET /health/ready
// @desc    Readiness probe for Kubernetes/container orchestration
// @access  Public
router.get('/ready', async (req, res) => {
  try {
    const dbHealth = await checkDBHealth();
    
    if (dbHealth.isHealthy) {
      res.status(200).json({
        success: true,
        message: 'Service is ready to receive traffic',
        timestamp: new Date().toISOString(),
        status: 'ready'
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Service is not ready',
        timestamp: new Date().toISOString(),
        status: 'not_ready',
        reason: 'Database connection failed'
      });
    }
  } catch (error) {
    console.error('Readiness check error:', error);
    res.status(503).json({
      success: false,
      message: 'Service is not ready',
      timestamp: new Date().toISOString(),
      status: 'not_ready',
      reason: 'Health check failed'
    });
  }
});

// @route   GET /health/live
// @desc    Liveness probe for Kubernetes/container orchestration
// @access  Public
router.get('/live', (req, res) => {
  // Liveness check just verifies the process is running
  res.status(200).json({
    success: true,
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    status: 'alive',
    uptime: process.uptime()
  });
});

// @route   GET /health/metrics
// @desc    Basic metrics for monitoring
// @access  Public
router.get('/metrics', (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        rss: process.memoryUsage().rss
      },
      cpu: process.cpuUsage(),
      system: {
        loadAverage: os.loadavg(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem()
      }
    };

    res.json({
      success: true,
      message: 'Metrics retrieved successfully',
      data: metrics
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve metrics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
});

module.exports = router;
