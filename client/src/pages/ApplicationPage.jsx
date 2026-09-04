import { useState } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  MenuItem,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  mobileNumber: '',
  address: '',
  feedback: '',
};

export default function ApplicationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.feedback) delete payload.feedback;

      await axiosClient.post('/submissions', payload);
      navigate('/application/success');
    } catch (err) {
      const data = err.response?.data;
      if (data?.details) {
        const mapped = {};
        data.details.forEach((d) => {
          mapped[d.field] = d.message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(data?.error || 'Submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Typography variant="h5" fontWeight={700}>Customer Application</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please complete the form below
        </Typography>

        <Card variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {formError && <Alert severity="error" sx={{ mb: 3 }}>{formError}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Gender"
                  value={form.gender}
                  onChange={handleChange('gender')}
                  error={!!fieldErrors.gender}
                  helperText={fieldErrors.gender}
                  required
                  fullWidth
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile Number"
                  value={form.mobileNumber}
                  onChange={handleChange('mobileNumber')}
                  error={!!fieldErrors.mobileNumber}
                  helperText={fieldErrors.mobileNumber || 'e.g. 0712345678'}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  value={form.address}
                  onChange={handleChange('address')}
                  error={!!fieldErrors.address}
                  helperText={fieldErrors.address}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Feedback (Optional)"
                  value={form.feedback}
                  onChange={handleChange('feedback')}
                  multiline
                  minRows={3}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: 'center', mt: 1 }}>
                <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ minWidth: 220 }}>
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
