const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const reviewController = require('../controllers/reviewController');

const router = Router();

router.post(
  '/contracts/:contractId',
  authenticate,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string'),
  validate,
  reviewController.createReview
);

router.get('/users/:userId', reviewController.getUserReviews);

module.exports = router;
