const express = require('express');
const router = express.Router();
const { Notification, User } = require('../models');
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, unreadOnly = false, type } = req.query;
    const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const where = { userId };
    if (unreadOnly === 'true') where.read = false;
    if (type) where.category = type;
    const { count, rows } = await Notification.findAndCountAll({
      where, order: [['createdAt', 'DESC']], limit: parsedLimit
    });
    const unreadCount = await Notification.count({ where: { userId, read: false } });
    res.json({ success: true, data: { notifications: rows, total: count, unreadCount, limit: parsedLimit } });
  } catch (error) {
    logger.error('Error getting notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const defaults = {
      enabled: true, categories: { alerts: true, disruptions: true, achievements: true, reminders: true, weather: true, promotions: false },
      pushEnabled: true, emailEnabled: false, smsEnabled: false,
      quietHours: { enabled: true, start: '22:00', end: '07:00' }
    };
    const settings = user?.notificationSettings || defaults;
    res.json({ success: true, data: settings });
  } catch (error) {
    logger.error('Error getting notification settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    user.notificationSettings = { ...user.notificationSettings, ...req.body };
    await user.save();
    res.json({ success: true, data: user.notificationSettings, message: 'Notification settings updated successfully' });
  } catch (error) {
    logger.error('Error updating notification settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this notification' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    logger.error('Error getting notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to modify this notification' });
    }
    await notification.update({ read: true });
    res.json({ success: true, data: notification, message: 'Notification marked as read' });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.update({ read: true }, { where: { userId, read: false } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this notification' });
    }
    await notification.destroy();
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
