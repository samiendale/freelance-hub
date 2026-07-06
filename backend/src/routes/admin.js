const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const adminController = require('../controllers/adminController');

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', adminController.getStats);

router.get('/users', adminController.manageUsers);

router.delete('/users/:id', adminController.deleteUser);

router.get('/jobs', adminController.manageJobs);

router.patch(
  '/jobs/:id/status',
  body('status').notEmpty().withMessage('Status is required')
    .isIn(['open', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be open, in_progress, completed, or cancelled'),
  validate,
  adminController.updateJobStatus
);

module.exports = router;
