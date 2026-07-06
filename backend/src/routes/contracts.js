const { Router } = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const contractController = require('../controllers/contractController');

const router = Router();

router.get('/', authenticate, contractController.getMyContracts);

router.get('/:id', authenticate, contractController.getContract);

router.patch(
  '/:id/status',
  authenticate,
  body('status').notEmpty().withMessage('Status is required')
    .isIn(['active', 'completed', 'terminated']).withMessage('Status must be active, completed, or terminated'),
  validate,
  contractController.updateContractStatus
);

module.exports = router;
