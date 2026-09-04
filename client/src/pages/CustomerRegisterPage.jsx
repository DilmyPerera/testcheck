import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function CustomerRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setFieldError = (field, message) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message || undefined }));
  };

  const checkConfirmMatch = (password, confirmPassword) => {
    if (!confirmPassword) {
      setFieldError('confirmPassword', undefined);
      return;
    }
    setFieldError('confirmPassword', confirmPassword === password ? undefined : 'Passwords do not match');
  };

  const handleEmailChange = (e) => {
    setForm((prev) => ({ ...prev, email: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, password: value }));
    if (value.length === 0 || value.length >= 4) {
      setFieldError('password', undefined);
    }
    checkConfirmMatch(value, form.confirmPassword);
  };

  const handlePasswordBlur = () => {
    if (form.password.length > 0 && form.password.length < 4) {
      setFieldError('password', 'Password must contain at least 4 characters');
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, confirmPassword: value }));
    checkConfirmMatch(form.password, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        const mapped = {};
        data.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>Create Your Account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Register to access the application portal
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>Account created successfully. You can now log in.</Alert>}
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={handleEmailChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password || 'Password must contain at least 4 characters'}
                required
                fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={handleConfirmChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
                {submitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account? <Link component={RouterLink} to="/login" fontWeight={600}>Login</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
