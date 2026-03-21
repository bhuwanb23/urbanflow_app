/**
 * User Profile Routes
 * GET /api/v1/user/profile - Get user profile
 * PUT /api/v1/user/profile - Update user profile
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock user database (replace with SQLite in production)
let users = new Map();

// Initialize with demo user
const initializeDemoUser = async () => {
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = {
    id: 'user-001',
    email: 'demo@urbanflow.com',
    password: hashedPassword,
    name: 'Demo User',
    phone: '+91 9876543210',
    preferences: {
      language: 'en',
      currency: 'INR',
      mobilityGoals: ['reduce_carbon', 'save_money'],
      preferredTransport: ['bus', 'train'],
      accessibilityNeeds: [],
      notificationsEnabled: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.set('user-001', demoUser);
  users.set('demo@urbanflow.com', demoUser); // Also index by email for lookup
};

initializeDemoUser();

/**
 * @route   GET /api/v1/user/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', async (req, res) => {
  try {
    // Extract user ID from JWT token (simplified for now)
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Return user data without password
    const { password, ...userData } = user;
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/v1/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const updates = req.body;
    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validate and update fields
    const allowedFields = ['name', 'phone', 'preferences'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        user[field] = { ...user[field], ...updates[field] };
      }
    });

    user.updatedAt = new Date().toISOString();
    users.set(userId, user);

    // Return updated user without password
    const { password, ...userData } = user;
    
    res.json({
      success: true,
      data: userData,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/user/preferences
 * @desc    Get user preferences only
 * @access  Private
 */
router.get('/preferences', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/v1/user/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const newPreferences = req.body;
    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Merge preferences
    user.preferences = { ...user.preferences, ...newPreferences };
    user.updatedAt = new Date().toISOString();
    users.set(userId, user);

    res.json({
      success: true,
      data: user.preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
