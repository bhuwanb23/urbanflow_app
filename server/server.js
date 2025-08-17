const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { sequelize } = require('./config/database');
const { User, Trip, Route, EcoStats, Notification, LiveTraffic } = require('./models');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'urbanflow_secret_key_2024';

// Server statistics
let serverStats = {
  startTime: new Date(),
  totalRequests: 0,
  authRequests: 0,
  apiRequests: 0,
  lastRequest: null
};

// Middleware to track requests
app.use((req, res, next) => {
  serverStats.totalRequests++;
  serverStats.lastRequest = new Date();
  
  if (req.path.startsWith('/api/auth')) {
    serverStats.authRequests++;
  } else if (req.path.startsWith('/api/')) {
    serverStats.apiRequests++;
  }
  
  next();
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Stats endpoint
app.get('/api/stats', (req, res) => {
  const uptime = Date.now() - serverStats.startTime.getTime();
  const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  
  res.json({
    ...serverStats,
    uptime: `${uptimeHours}h ${uptimeMinutes}m`,
    uptimeMs: uptime
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Demo data endpoints (keeping these for backward compatibility)
app.get('/api/demo/traffic', (req, res) => {
  const trafficData = {
    conditions: [
      { level: 'High Traffic', icon: 'trending-up', color: '#ef4444', place: 'Main Highway', change: '+28% than usual', delay: '45 min delay' },
      { level: 'Moderate', icon: 'minus', color: '#facc15', place: 'City Center', change: 'Normal flow', delay: '15 min delay' },
      { level: 'Light Traffic', icon: 'trending-down', color: '#22c55e', place: 'Residential Areas', change: '-10% than usual', delay: 'No delays' },
      { level: 'Road Work', icon: 'information', color: '#3b82f6', place: 'West Boulevard', change: 'Lane closed', delay: 'Avoid if possible' },
    ],
    updates: [
      { icon: 'alert-circle', color: '#ef4444', title: 'Accident Reported', desc: 'Major intersection at Park Road and Main Street', time: '2 minutes ago' },
      { icon: 'tools', color: '#facc15', title: 'New Construction Zone', desc: 'Highway 101 southbound near exit 25', time: '15 minutes ago' },
      { icon: 'check-circle', color: '#22c55e', title: 'Road Cleared', desc: 'Downtown expressway now open after earlier incident', time: '28 minutes ago' },
    ]
  };
  res.json(trafficData);
});

app.get('/api/demo/routes', (req, res) => {
  const routesData = [
    {
      from: 'Connaught Place',
      to: 'India Gate',
      modes: ['train', 'bus'],
      time: '25 min',
      cost: '₹35',
      eco: '8.5',
      ecoColor: '#10B981',
    },
    {
      from: 'Rajiv Chowk',
      to: 'Karol Bagh',
      modes: ['train'],
      time: '15 min',
      cost: '₹20',
      eco: '9.2',
      ecoColor: '#10B981',
    },
    {
      from: 'Khan Market',
      to: 'Lajpat Nagar',
      modes: ['bus', 'auto'],
      time: '18 min',
      cost: '₹45',
      eco: '7.8',
      ecoColor: '#10B981',
    },
  ];
  res.json(routesData);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (create tables if they don't exist, but don't alter existing ones)
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 UrbanFlow API server running on port ${PORT}`);
      console.log(`🌐 Dashboard: http://localhost:${PORT}/dashboard`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Server stats: http://localhost:${PORT}/api/stats`);
      console.log(`🔐 API endpoints:`);
      console.log(`   POST /api/v1/auth/register`);
      console.log(`   POST /api/v1/auth/login`);
      console.log(`   GET  /api/v1/auth/verify`);
      console.log(`   POST /api/v1/auth/logout`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
