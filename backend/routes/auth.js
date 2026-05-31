const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'urbanflow-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name: name || '', phone: phone || '' });
    const token = generateToken(user);
    const { password: _, ...userData } = user.toJSON();
    res.status(201).json({ success: true, data: { token, user: userData }, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    const { password: _, ...userData } = user.toJSON();
    res.json({ success: true, data: { token, user: userData }, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'urbanflow-secret-key-change-in-production');
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    const { password: _, ...userData } = user.toJSON();
    res.json({ success: true, data: userData });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

router.post('/logout', async (req, res) => {
  res.json({ success: true, message: 'Logout successful. Please remove the token from client side.' });
});

router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'urbanflow-secret-key-change-in-production');
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    const newToken = generateToken(user);
    res.json({ success: true, data: { token: newToken } });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

module.exports = router;
