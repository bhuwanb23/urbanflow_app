const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./config/database');
const apiRoutes = require('./routes');

// Import models to ensure associations are loaded
require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Server statistics
let serverStats = {
  startTime: new Date(),
  totalRequests: 0,
  apiRequests: 0,
  lastRequest: null
};

// Middleware to track requests
app.use((req, res, next) => {
  serverStats.totalRequests++;
  serverStats.lastRequest = new Date();
  
  if (req.path.startsWith('/api/')) {
    serverStats.apiRequests++;
  }
  
  next();
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Database Dashboard route
app.get('/db-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'db-dashboard.html'));
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
