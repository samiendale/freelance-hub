const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const categoryController = require('../controllers/categoryController');

const router = Router();

router.get('/', categoryController.getAll);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  body('name').notEmpty().withMessage('Name is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  validate,
  categoryController.create
);

router.delete('/:id', authenticate, authorize('admin'), categoryController.delete);

module.exports = router;
