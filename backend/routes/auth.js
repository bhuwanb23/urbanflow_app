const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const { User } = require('../models');
const { registerSchema, loginSchema, validate } = require('../validators/auth');

// Per-route rate limiters
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many login attempts, please try again later.' }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many registration attempts, please try again later.' }
});

// Account lockout tracking (in-memory)
const loginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least 1 number';
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-~`+=\[\]\\';\/]/.test(password)) {
    return 'Password must contain at least 1 special character';
  }
  return null;
};

router.post('/register', registerLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ success: false, error: passwordError });
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

router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Check account lockout
    const attempt = loginAttempts.get(email);
    if (attempt && attempt.lockedUntil > Date.now()) {
      const remaining = Math.ceil((attempt.lockedUntil - Date.now()) / 1000 / 60);
      logger.warn(`Login attempt on locked account: ${email}`);
      return res.status(423).json({ success: false, error: `Account locked. Try again in ${remaining} minute(s).` });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Use same generic message to not reveal whether email exists
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Track failed attempt
      const current = loginAttempts.get(email) || { count: 0, lockedUntil: 0 };
      current.count++;
      if (current.count >= MAX_FAILED_ATTEMPTS) {
        current.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        logger.warn(`Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts: ${email}`);
      }
      loginAttempts.set(email, current);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Successful login — reset attempts
    loginAttempts.delete(email);
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
    const decoded = jwt.verify(token, getJwtSecret());
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
    const decoded = jwt.verify(token, getJwtSecret());
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
