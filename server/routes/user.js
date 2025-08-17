const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

// Validation middleware
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('location.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('location.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  body('sustainabilityGoals.dailyCO2Target')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Daily CO2 target must be a positive number'),
  body('sustainabilityGoals.weeklyWalkingTarget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weekly walking target must be a positive number')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// @route   GET /api/v1/user/profile
// @desc    Get user profile
// @access  Private (requires authentication)
router.get('/profile', async (req, res) => {
  try {
    // This route requires authentication middleware
    // For now, we'll return a message indicating it needs auth
    res.json({
      success: true,
      message: 'This endpoint requires authentication. Please implement auth middleware.',
      note: 'Use the /auth/me endpoint or implement proper authentication middleware'
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/v1/user/profile
// @desc    Update user profile
// @access  Private (requires authentication)
router.put('/profile', validateProfileUpdate, handleValidationErrors, async (req, res) => {
  try {
    // This route requires authentication middleware
    // For now, we'll return a message indicating it needs auth
    res.json({
      success: true,
      message: 'This endpoint requires authentication. Please implement auth middleware.',
      note: 'Use the /auth/me endpoint or implement proper authentication middleware'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/v1/user/settings
// @desc    Get user settings
// @access  Private (requires authentication)
router.get('/settings', async (req, res) => {
  try {
    // This route requires authentication middleware
    res.json({
      success: true,
      message: 'This endpoint requires authentication. Please implement auth middleware.'
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/v1/user/settings
// @desc    Update user settings
// @access  Private (requires authentication)
router.put('/settings', async (req, res) => {
  try {
    // This route requires authentication middleware
    res.json({
      success: true,
      message: 'This endpoint requires authentication. Please implement auth middleware.'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/v1/user/stats
// @desc    Get user statistics
// @access  Private (requires authentication)
router.get('/stats', async (req, res) => {
  try {
    // This route requires authentication middleware
    res.json({
      success: true,
      message: 'This endpoint requires authentication. Please implement auth middleware.'
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/v1/user/account
// @desc    Delete user account
// @access  Private (requires authentication)
router.delete('/account', async (req, res) => {
  try {
    // This route requires authentication middleware
    res.json({
      success: true,
      message: 'This endpoint requires authentication. Please implement auth middleware.'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
