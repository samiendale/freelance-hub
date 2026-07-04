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
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  validate,
  jobController.createJob
);

router.put(
  '/:id',
  authenticate,
  authorize('employer'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  validate,
  jobController.updateJob
);

router.delete('/:id', authenticate, authorize('employer'), jobController.deleteJob);

module.exports = router;
