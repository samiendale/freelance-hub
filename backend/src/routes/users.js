const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const userController = require('../controllers/userController');

const router = Router();

router.get('/freelancers', userController.listFreelancers);

router.get('/:id', userController.getProfile);

router.put(
  '/profile',
  authenticate,
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .matches(/^[^\d]+$/).withMessage('Name cannot contain numbers'),
  body('bio').optional().trim(),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  validate,
  userController.updateProfile
);

module.exports = router;
