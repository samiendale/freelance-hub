const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { register, login, refreshToken, getMe } = require('../controllers/authController');

const router = Router();

router.post(
  '/register',
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .matches(/^[^\d]+$/).withMessage('Name cannot contain numbers'),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character'),
  body('role').isIn(['employer', 'freelancer']).withMessage('Role must be employer or freelancer'),
  validate,
  register
);

router.post(
  '/login',
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
  login
);

router.post('/refresh', refreshToken);

router.get('/me', authenticate, getMe);

module.exports = router;
