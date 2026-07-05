const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const bidController = require('../controllers/bidController');

const router = express.Router({ mergeParams: true });

router.get('/my', authenticate, authorize('freelancer'), bidController.getMyBids);

router.get('/jobs/:jobId', authenticate, authorize('employer'), bidController.getJobBids);

router.post(
  '/jobs/:jobId',
  authenticate,
  authorize('freelancer'),
  body('amount').isNumeric(),
  body('description').notEmpty(),
  body('timeline').isInt(),
  validate,
  bidController.createBid
);

router.put(
  '/:id',
  authenticate,
  authorize('freelancer'),
  body('amount').optional().isNumeric(),
  body('description').optional().notEmpty(),
  body('timeline').optional().isInt(),
  validate,
  bidController.updateBid
);

router.delete('/:id', authenticate, authorize('freelancer'), bidController.deleteBid);

router.patch('/:id/accept', authenticate, authorize('employer'), bidController.acceptBid);

module.exports = router;
