const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { register, login, refreshToken, getMe } = require('../controllers/authController');

const router = Router();

router.post(
  '/register',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['employer', 'freelancer']).withMessage('Role must be employer or freelancer'),
  validate,
  register
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
  login
);

router.post('/refresh', refreshToken);

router.get('/me', authenticate, getMe);

module.exports = router;
