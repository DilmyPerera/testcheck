const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAdminSchema } = require('../validators/authValidators');
const { createAdmin } = require('../controllers/authController');

const router = Router();

router.post('/admins', authenticate, authorize('ADMIN'), validate(createAdminSchema), createAdmin);

module.exports = router;
