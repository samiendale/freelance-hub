const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.get('/', jobController.getJobs);

router.get('/my', authenticate, authorize('employer'), jobController.getMyJobs);

router.get('/:id', jobController.getJob);

router.post(
  '/',
  authenticate,
  authorize('employer'),
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  validate,
  jobController.createJob
);

router.put(
  '/:id',
  authenticate,
  authorize('employer'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  validate,
  jobController.updateJob
);

router.delete('/:id', authenticate, authorize('employer'), jobController.deleteJob);

module.exports = router;
