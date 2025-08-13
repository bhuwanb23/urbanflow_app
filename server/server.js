const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'urbanflow_secret_key_2024';

// In-memory user storage (in production, use a database)
let users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@urbanflow.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    createdAt: new Date()
  }
];

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

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'UrbanFlow API is running' });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// User profile routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== users[userIndex].email) {
      const existingUser = users.find(u => u.email === email && u.id !== req.user.userId);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      updatedAt: new Date()
    };

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint (client-side token removal)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
});

// Demo data endpoints
app.get('/api/demo/traffic', (req, res) => {
  const trafficData = {
    conditions: [
      { level: 'High Traffic', icon: 'trending-up', color: '#ef4444', place: 'Main Highway', change: '+28% than usual', delay: '45 min delay' },
      { level: 'Moderate', icon: 'trending-flat', color: '#facc15', place: 'City Center', change: 'Normal flow', delay: '15 min delay' },
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 UrbanFlow API server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/auth/verify`);
  console.log(`   POST /api/auth/logout`);
});

module.exports = app;
