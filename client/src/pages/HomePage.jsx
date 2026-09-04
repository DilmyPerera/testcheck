import { Box, Container, Typography, Button, Stack, Grid, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

const HIGHLIGHTS = [
  { icon: <LockRoundedIcon color="primary" />, label: 'Secure Access' },
  { icon: <DescriptionRoundedIcon color="primary" />, label: 'Easy Application' },
  { icon: <BoltRoundedIcon color="primary" />, label: 'Fast Process' },
];

export default function HomePage() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)' }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center', pt: { xs: 7, md: 10 }, pb: { xs: 5, md: 6 } }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Customer Application Management System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A secure and simple way to submit and manage your customer application.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" size="large" component={RouterLink} to="/register">
            Apply Now
          </Button>
          <Button variant="outlined" size="large" component={RouterLink} to="/login">
            Customer Login
          </Button>
        </Stack>
      </Container>

      <Divider />

      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 6 } }}>
        <Typography
          variant="overline"
          align="center"
          display="block"
          color="text.secondary"
          sx={{ letterSpacing: 2, mb: 3 }}
        >
          Simple &bull; Secure &bull; Efficient
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {HIGHLIGHTS.map((item) => (
            <Grid item xs={12} sm={4} key={item.label}>
              <Stack spacing={1} alignItems="center">
                {item.icon}
                <Typography variant="body2" fontWeight={600}>
                  {item.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
