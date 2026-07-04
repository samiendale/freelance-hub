const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');
const applicationController = require('../controllers/applicationController');

const router = express.Router({ mergeParams: true });

router.get('/my', authenticate, authorize('freelancer'), applicationController.getMyApplications);

router.get('/jobs/:jobId', authenticate, authorize('employer'), applicationController.getJobApplications);

router.post(
  '/jobs/:jobId',
  authenticate,
  authorize('freelancer'),
  upload.single('resume'),
  body('name').notEmpty().withMessage('Name is required'),
  body('cover_letter').notEmpty().withMessage('Cover letter is required'),
  validate,
  applicationController.apply
);

router.patch('/:id/accept', authenticate, authorize('employer'), applicationController.acceptApplication);

module.exports = router;
