import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', form);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" align="center" color="success.main" fontWeight={700} mb={3}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Alert severity="info" sx={{ mb: 2, fontSize: 15 }}>
            For testing: <b>admin@pastas.lt</b> / <b>slaptazodis123</b>
          </Alert>
          <TextField
            name="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            size="large"
            autoComplete="off"
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            size="large"
            autoComplete="off"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="success"
            size="large"
            fullWidth
            sx={{ mt: 3, borderRadius: 2, fontWeight: 700, letterSpacing: 1 }}
            startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <LoginIcon />}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
