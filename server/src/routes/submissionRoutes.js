const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createSubmissionSchema,
  updateSubmissionSchema,
} = require('../validators/submissionValidators');
const { create, list, update, remove } = require('../controllers/submissionController');

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('CUSTOMER'),
  validate(createSubmissionSchema),
  create,
);

router.get('/', authenticate, authorize('ADMIN'), list);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateSubmissionSchema),
  update,
);

router.delete('/:id', authenticate, authorize('ADMIN'), remove);

module.exports = router;
