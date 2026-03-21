/**
 * Authentication Routes
 * POST /api/v1/auth/register - Register new user
 * POST /api/v1/auth/login - Login user
 * POST /api/v1/auth/verify - Verify JWT token
 * POST /api/v1/auth/logout - Logout user
 * POST /api/v1/auth/refresh - Refresh JWT token
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock users database (replace with SQLite in production)
let users = new Map();

// Initialize with demo user
const initializeDemoUsers = async () => {
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = {
    id: 'user-001',
    email: 'demo@urbanflow.com',
    password: hashedPassword,
    name: 'Demo User',
    phone: '+91 9876543210',
    createdAt: new Date().toISOString()
  };
  users.set('demo@urbanflow.com', demoUser);
};

initializeDemoUsers();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'urbanflow-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      name: name || '',
      phone: phone || '',
      createdAt: new Date().toISOString()
    };
    
    users.set(email, newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    // Return user data without password
    const { password: _, ...userData } = newUser;
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: userData
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.get(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data without password
    const { password: _, ...userData } = user;
    
    res.json({
      success: true,
      data: {
        token,
        user: userData
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/auth/verify
 * @desc    Verify JWT token
 * @access  Private
 */
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'urbanflow-secret-key-change-in-production'
    );
    
    // Find user
    const user = Array.from(users.values()).find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    // Return user data without password
    const { password: _, ...userData } = user;
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client should remove token)
 * @access  Private
 */
router.post('/logout', async (req, res) => {
  try {
    // In a real application, you might blacklist the token
    // For now, just confirm logout
    res.json({
      success: true,
      message: 'Logout successful. Please remove the token from client side.'
    });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify current token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'urbanflow-secret-key-change-in-production'
    );
    
    // Find user
    const user = Array.from(users.values()).find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    // Generate new token
    const newToken = generateToken(user);
    
    res.json({
      success: true,
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

module.exports = router;
