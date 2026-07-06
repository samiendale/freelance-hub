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
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .matches(/^[^\d]+$/).withMessage('Name cannot contain numbers'),
  body('cover_letter').notEmpty().withMessage('Cover letter is required'),
  validate,
  applicationController.apply
);

router.patch('/:id/accept', authenticate, authorize('employer'), applicationController.acceptApplication);

router.patch(
  '/:id/reject',
  authenticate,
  authorize('employer'),
  body('rejection_reason')
    .trim()
    .notEmpty().withMessage('Rejection reason is required'),
  validate,
  applicationController.rejectApplication
);

module.exports = router;
