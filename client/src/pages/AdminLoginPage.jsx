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
  Avatar,
} from '@mui/material';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminLogin(form);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1.5, width: 48, height: 48 }}>
            <ShieldRoundedIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={700}>Administrator Portal</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Secure administrator access
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Admin Email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
                {submitting ? 'Signing in…' : 'Admin Sign In'}
              </Button>
            </Stack>
          </form>
        </Paper>

        <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mt: 2.5, color: 'text.secondary' }}>
          <LockRoundedIcon fontSize="small" />
          <Typography variant="caption">Restricted Access</Typography>
        </Stack>
      </Container>
    </Box>
  );
}
