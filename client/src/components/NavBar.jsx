import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useAuth } from '../context/AuthContext.jsx';

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Button
      component={RouterLink}
      to={to}
      sx={{
        color: active ? 'primary.main' : 'text.primary',
        px: 1.75,
        fontWeight: active ? 700 : 500,
        bgcolor: active ? 'rgba(30,58,138,0.08)' : 'transparent',
        '&:hover': { bgcolor: 'rgba(30,58,138,0.06)' },
      }}
    >
      {children}
    </Button>
  );
}

function LoginMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownRoundedIcon />}
        sx={{ color: 'text.primary', px: 1.75, fontWeight: 500 }}
      >
        Login
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem component={RouterLink} to="/login" onClick={() => setAnchorEl(null)}>
          <ListItemIcon><HowToRegRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Customer Login" secondary="Submit an application" />
        </MenuItem>
        <MenuItem component={RouterLink} to="/admin/login" onClick={() => setAnchorEl(null)}>
          <ListItemIcon><AdminPanelSettingsRoundedIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Admin Login" secondary="Manage submissions" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          component={RouterLink}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          <FactCheckRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
            CAMS
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {!user && (
            <>
              <NavLink to="/">Home</NavLink>
              <LoginMenu />
              <Button component={RouterLink} to="/register" variant="contained" sx={{ ml: 1 }}>
                Register
              </Button>
            </>
          )}

          {user && user.role === 'CUSTOMER' && (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/application">Application</NavLink>
              <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
              <Chip
                icon={<PersonRoundedIcon />}
                label={user.email}
                sx={{ bgcolor: 'rgba(30,58,138,0.06)', fontWeight: 500 }}
              />
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} sx={{ color: 'text.secondary' }}>
                  <LogoutRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
              <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />
              <Chip
                icon={<PersonRoundedIcon />}
                label={user.email}
                sx={{ bgcolor: 'rgba(30,58,138,0.06)', fontWeight: 500 }}
              />
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} sx={{ color: 'text.secondary' }}>
                  <LogoutRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
