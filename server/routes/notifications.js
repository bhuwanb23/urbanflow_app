const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

// GET /api/v1/notifications - Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        {
          model: require('../models').User,
          as: 'notificationUser',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// GET /api/v1/notifications/count - Get notification count
router.get('/count', async (req, res) => {
  try {
    const count = await Notification.count();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error counting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting notifications',
      error: error.message
    });
  }
});

// PUT /api/v1/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.update({ isRead: true });
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
});

module.exports = router;
