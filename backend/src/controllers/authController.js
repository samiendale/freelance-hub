const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const logger = require('../utils/logger');

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password_hash,
      role,
    });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { password_hash: _, ...userData } = user.toJSON();

    return res.status(201).json({ user: userData, accessToken, refreshToken });
  } catch (err) {
    logger.error('Register error', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { password_hash: _, ...userData } = user.toJSON();

    return res.status(200).json({ user: userData, accessToken, refreshToken });
  } catch (err) {
    logger.error('Login error', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    logger.error('Refresh token error', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    logger.error('GetMe error', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { register, login, refreshToken, getMe };
