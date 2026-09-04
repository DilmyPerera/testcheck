import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Chip,
  Grid,
  InputAdornment,
  Divider,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import axiosClient from '../api/axiosClient';
import SubmissionEditDialog from '../components/SubmissionEditDialog.jsx';

const EMPTY_STATS = { total: 0, male: 0, female: 0, other: 0 };

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gender, setGender] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (gender) params.gender = gender;
      if (search) params.search = search;
      const { data } = await axiosClient.get('/submissions', { params });
      setSubmissions(data.submissions);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }, [gender, search]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axiosClient.get('/submissions');
      const all = data.submissions;
      setStats({
        total: all.length,
        male: all.filter((s) => s.gender === 'MALE').length,
        female: all.filter((s) => s.gender === 'FEMALE').length,
        other: all.filter((s) => s.gender === 'OTHER').length,
      });
    } catch {
      // stats are a non-critical enhancement; ignore failures silently
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchSubmissions, 250);
    return () => clearTimeout(timeout);
  }, [fetchSubmissions]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = () => {
    fetchSubmissions();
    fetchStats();
  };

  const handleSave = async (id, payload) => {
    const { data } = await axiosClient.patch(`/submissions/${id}`, payload);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? data.submission : s)));
    setEditing(null);
    fetchStats();
  };

  const handleDelete = async () => {
    await axiosClient.delete(`/submissions/${deleting.id}`);
    setSubmissions((prev) => prev.filter((s) => s.id !== deleting.id));
    setDeleting(null);
    fetchStats();
  };

  const STAT_CARDS = [
    { label: 'Total Applications', value: stats.total },
    { label: 'Male', value: stats.male },
    { label: 'Female', value: stats.female },
    { label: 'Other', value: stats.other },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 72px)', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={700}>Admin Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage and review all submitted applications
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {STAT_CARDS.map((card) => (
            <Grid item xs={6} sm={3} key={card.label}>
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Typography variant="body2" color="text.secondary">{card.label}</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>{card.value}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <TextField
              placeholder="Search by first or last name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              sx={{ minWidth: { xs: '100%', sm: 160 } }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={handleRefresh}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Refresh
            </Button>
          </Stack>
        </Card>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading && (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!loading && submissions.length === 0 && (
          <Card variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography color="text.secondary">No applications found.</Typography>
          </Card>
        )}

        {!loading && submissions.length > 0 && (
          <>
            {/* Desktop table */}
            <Card variant="outlined" sx={{ borderRadius: 3, display: { xs: 'none', md: 'block' } }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissions.map((s) => (
                      <TableRow key={s.id} hover>
                        <TableCell>{String(s.id).padStart(2, '0')}</TableCell>
                        <TableCell>{s.firstName} {s.lastName}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell><Chip label={s.gender} size="small" /></TableCell>
                        <TableCell>{s.mobileNumber}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => setEditing(s)} aria-label="edit">
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleting(s)} aria-label="delete">
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Mobile card list */}
            <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
              {submissions.map((s) => (
                <Card key={s.id} variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography fontWeight={700}>{s.firstName} {s.lastName}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.email}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Chip label={s.gender} size="small" />
                    <Typography variant="body2" color="text.secondary">{s.mobileNumber}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<EditRoundedIcon fontSize="small" />} onClick={() => setEditing(s)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteRoundedIcon fontSize="small" />} onClick={() => setDeleting(s)}>
                      Delete
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Container>

      <SubmissionEditDialog
        key={editing?.id ?? 'closed'}
        submission={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />

      <Dialog open={!!deleting} onClose={() => setDeleting(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Application?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete the application for{' '}
            <strong>{deleting?.firstName} {deleting?.lastName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
