const { z } = require('zod');

// Generic local mobile number format: optional country code (1-3 digits, with
// optional leading +) followed by 9-10 digits, with optional separators.
// Adjust this pattern in one place if you need a stricter, country-specific format.
const MOBILE_REGEX = /^(\+?\d{1,3}[- ]?)?\d{9,10}$/;

const createSubmissionSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Invalid email format'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Gender must be MALE, FEMALE, or OTHER' }),
  }),
  mobileNumber: z
    .string()
    .trim()
    .regex(MOBILE_REGEX, 'Invalid mobile number format'),
  address: z.string().trim().min(1, 'Address is required'),
  feedback: z.string().trim().optional(),
});

const updateSubmissionSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
  email: z.string().trim().email('Invalid email format').optional(),
  gender: z
    .enum(['MALE', 'FEMALE', 'OTHER'], {
      errorMap: () => ({ message: 'Gender must be MALE, FEMALE, or OTHER' }),
    })
    .optional(),
  mobileNumber: z
    .string()
    .trim()
    .regex(MOBILE_REGEX, 'Invalid mobile number format')
    .optional(),
  address: z.string().trim().min(1, 'Address is required').optional(),
  feedback: z.string().trim().nullable().optional(),
});

module.exports = { createSubmissionSchema, updateSubmissionSchema };
