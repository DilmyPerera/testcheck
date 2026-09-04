const { z } = require('zod');

const registerSchema = z
  .object({
    email: z.string().trim().email('Invalid email format'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

const createAdminSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  createAdminSchema,
};
