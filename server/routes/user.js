const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

// GET /api/v1/user - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// GET /api/v1/user/count - Get user count
router.get('/count', async (req, res) => {
  try {
    const count = await User.count();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting users',
      error: error.message
    });
  }
});

// GET /api/v1/user/profile - Get user profile (requires auth)
router.get('/profile', async (req, res) => {
  try {
    // For now, return first user as demo
    const user = await User.findOne({
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// PUT /api/v1/user/profile - Update user profile (requires auth)
router.put('/profile', [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // For demo, update first user
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update(req.body);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
});

// GET /api/v1/user/settings - Get user settings (requires auth)
router.get('/settings', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'preferences', 'notificationSettings', 'privacySettings']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        preferences: user.preferences || {},
        notificationSettings: user.notificationSettings || {},
        privacySettings: user.privacySettings || {}
      }
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user settings',
      error: error.message
    });
  }
});

// PUT /api/v1/user/settings - Update user settings (requires auth)
router.put('/settings', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { preferences, notificationSettings, privacySettings } = req.body;
    
    await user.update({
      preferences: { ...user.preferences, ...preferences },
      notificationSettings: { ...user.notificationSettings, ...notificationSettings },
      privacySettings: { ...user.privacySettings, ...privacySettings }
    });
    
    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user settings',
      error: error.message
    });
  }
});

// GET /api/v1/user/stats - Get user statistics (requires auth)
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'currentStats', 'ecoScore', 'totalTrips', 'totalDistance']
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        currentStats: user.currentStats || {},
        ecoScore: user.ecoScore || 0,
        totalTrips: user.totalTrips || 0,
        totalDistance: user.totalDistance || 0
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error.message
    });
  }
});

// DELETE /api/v1/user/account - Delete user account (requires auth)
router.delete('/account', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user account',
      error: error.message
    });
  }
});

module.exports = router;
