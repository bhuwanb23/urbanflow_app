const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const tokenBlacklist = require('../utils/tokenBlacklist');
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
    logger.error('Error registering user:', error);
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
    logger.error('Error logging in user:', error);
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
    logger.error('Error verifying token:', error);
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      tokenBlacklist.add(token, decoded ? decoded.exp * 1000 : undefined);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    logger.error('Error in logout:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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
    logger.error('Error refreshing token:', error);
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

// Rate limiter for password reset
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, error: 'Too many password reset requests. Try again in an hour.' }
});

router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user) {
      return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}&email=${email}`;
    logger.info(`Password reset link for ${email}: ${resetUrl}`);

    res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    logger.error('Error in forgot-password:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      return res.status(400).json({ success: false, error: 'Token, email, and password are required' });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ success: false, error: passwordError });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: { email, passwordResetToken: hashedToken, passwordResetExpires: { [Op.gt]: new Date() } }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    logger.info(`Password reset successful for: ${email}`);
    res.json({ success: true, message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    logger.error('Error in reset-password:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
