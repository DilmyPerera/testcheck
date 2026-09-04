import { Box, Container, Card, Typography, Button, Stack } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useNavigate } from 'react-router-dom';

export default function ApplicationSuccessPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Card variant="outlined" sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircleRoundedIcon color="success" sx={{ fontSize: 56, mb: 2 }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Application submitted successfully
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Thank you. We&apos;ve received your details.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/application')}>
              Submit Another
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
