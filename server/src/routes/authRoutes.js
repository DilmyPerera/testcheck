const { Router } = require('express');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/authValidators');
const { register, login, adminLogin, refresh } = require('../controllers/authController');

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/admin/login', validate(loginSchema), adminLogin);
router.post('/refresh', validate(refreshSchema), refresh);

module.exports = router;
