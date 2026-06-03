const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { updateProfileSchema, validate } = require('../validators/user');

router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { password, ...userData } = user.toJSON();
    res.json({ success: true, data: userData });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/profile', validate(updateProfileSchema), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const allowedFields = ['name', 'phone', 'preferences'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'preferences') {
          user.preferences = { ...user.preferences, ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });
    await user.save();
    const { password, ...userData } = user.toJSON();
    res.json({ success: true, data: userData, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/preferences', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user.preferences });
  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/preferences', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    res.json({ success: true, data: user.preferences, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
