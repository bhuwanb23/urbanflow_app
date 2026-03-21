/**
 * Notifications Routes
 * GET /api/v1/notifications - Get user notifications
 * GET /api/v1/notifications/:id - Get specific notification
 * PUT /api/v1/notifications/:id/read - Mark as read
 * PUT /api/v1/notifications/read-all - Mark all as read
 * DELETE /api/v1/notifications/:id - Delete notification
 * GET /api/v1/notifications/settings - Get notification settings
 * PUT /api/v1/notifications/settings - Update notification settings
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock notifications database (replace with SQLite in production)
let notifications = new Map();
let notificationSettings = new Map();

// Initialize with demo notifications
const initializeDemoNotifications = () => {
  const now = Date.now();
  const demoNotifications = [
    {
      id: 'notif-001',
      userId: 'user-001',
      type: 'alert',
      title: 'Service Disruption',
      message: 'Bus route 502-A delayed by 15 minutes due to traffic congestion on Outer Ring Road.',
      severity: 'warning',
      isRead: false,
      createdAt: new Date(now - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      actionUrl: '/route/502-A'
    },
    {
      id: 'notif-002',
      userId: 'user-001',
      type: 'achievement',
      title: '🎉 Carbon Warrior Unlocked!',
      message: 'Congratulations! You\'ve saved 20 kg of CO2 this month. Keep up the great work!',
      severity: 'info',
      isRead: false,
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      actionUrl: '/ecostats'
    },
    {
      id: 'notif-003',
      userId: 'user-001',
      type: 'reminder',
      title: 'Complete Your Journey',
      message: 'You started a trip 30 minutes ago. Don\'t forget to mark it as completed!',
      severity: 'info',
      isRead: true,
      createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      actionUrl: '/trips'
    },
    {
      id: 'notif-004',
      userId: 'user-001',
      type: 'weather',
      title: 'Heavy Rain Alert',
      message: 'Expected heavy rainfall in Bengaluru this evening. Plan your commute accordingly.',
      severity: 'warning',
      isRead: true,
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      actionUrl: '/live'
    },
    {
      id: 'notif-005',
      userId: 'user-001',
      type: 'promotion',
      title: 'Weekly Challenge',
      message: 'Take 10 bus trips this week and unlock the Green Commuter badge!',
      severity: 'info',
      isRead: true,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      actionUrl: '/ecostats'
    }
  ];
  
  demoNotifications.forEach(notif => {
    notifications.set(notif.id, notif);
  });
  
  // Initialize default settings
  notificationSettings.set('user-001', {
    enabled: true,
    categories: {
      alerts: true,
      disruptions: true,
      achievements: true,
      reminders: true,
      weather: true,
      promotions: false
    },
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    }
  });
};

initializeDemoNotifications();

/**
 * @route   GET /api/v1/notifications
 * @desc    Get user notifications with optional filtering
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const { limit = 20, unreadOnly = false, type } = req.query;
    
    // Filter notifications by user
    let userNotifications = Array.from(notifications.values())
      .filter(n => n.userId === userId);
    
    // Apply filters
    if (unreadOnly === 'true') {
      userNotifications = userNotifications.filter(n => !n.isRead);
    }
    
    if (type) {
      userNotifications = userNotifications.filter(n => n.type === type);
    }
    
    // Sort by date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const paginatedNotifications = userNotifications.slice(0, parseInt(limit));
    
    // Count unread
    const unreadCount = userNotifications.filter(n => !n.isRead).length;
    
    res.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        total: userNotifications.length,
        unreadCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/notifications/:id
 * @desc    Get specific notification by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = notifications.get(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error getting notification:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/v1/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = notifications.get(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    notification.isRead = true;
    notifications.set(notificationId, notification);
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/v1/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    // Mark all user notifications as read
    notifications.forEach((notif, id) => {
      if (notif.userId === userId) {
        notif.isRead = true;
        notifications.set(id, notif);
      }
    });
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = notifications.get(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }
    
    notifications.delete(notificationId);
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/notifications/settings
 * @desc    Get user notification settings
 * @access  Private
 */
router.get('/settings', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const settings = notificationSettings.get(userId);
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Settings not found'
      });
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting notification settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/v1/notifications/settings
 * @desc    Update user notification settings
 * @access  Private
 */
router.put('/settings', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const newSettings = req.body;
    const currentSettings = notificationSettings.get(userId) || {};
    
    // Merge settings
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
      categories: {
        ...(currentSettings.categories || {}),
        ...(newSettings.categories || {})
      },
      quietHours: {
        ...(currentSettings.quietHours || {}),
        ...(newSettings.quietHours || {})
      }
    };
    
    notificationSettings.set(userId, updatedSettings);
    
    res.json({
      success: true,
      data: updatedSettings,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
