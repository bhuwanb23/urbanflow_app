const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Notification } = require('../models');

const getUserId = (req) => {
  try {
    return jwt.decode(req.headers.authorization?.split(' ')[1])?.id || null;
  } catch { return null; }
};

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const { limit = 20, unreadOnly = false, type } = req.query;
    const where = { userId };
    if (unreadOnly === 'true') where.read = false;
    if (type) where.category = type;
    const { count, rows } = await Notification.findAndCountAll({
      where, order: [['createdAt', 'DESC']], limit: parseInt(limit)
    });
    const unreadCount = await Notification.count({ where: { userId, read: false } });
    res.json({ success: true, data: { notifications: rows, total: count, unreadCount, limit: parseInt(limit) } });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const defaults = {
      enabled: true, categories: { alerts: true, disruptions: true, achievements: true, reminders: true, weather: true, promotions: false },
      pushEnabled: true, emailEnabled: false, smsEnabled: false,
      quietHours: { enabled: true, start: '22:00', end: '07:00' }
    };
    res.json({ success: true, data: defaults });
  } catch (error) {
    console.error('Error getting notification settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    res.json({ success: true, data: req.body, message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error getting notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    await notification.update({ read: true });
    res.json({ success: true, data: notification, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/read-all', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    await Notification.update({ read: true }, { where: { userId, read: false } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    await notification.destroy();
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
