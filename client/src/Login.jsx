import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          py: 3,
          bgcolor: 'rgba(33,150,243,0.12)',
          textAlign: 'center',
          zIndex: 2,
          boxShadow: '0 2px 12px 0 rgba(33,150,243,0.10)',
        }}
      >
        <Typography
          variant="h3"
          fontWeight={900}
          color="primary"
          sx={{ letterSpacing: 2, textShadow: '0 2px 8px rgba(33,150,243,0.10)' }}
        >
          Virtual bank
        </Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2, md: 5 },
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(33,150,243,0.18)',
          bgcolor: '#fff',
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={900}
          mb={2}
          color="primary"
          sx={{ letterSpacing: 1, textShadow: '0 2px 8px rgba(33,150,243,0.10)' }}
        >
          Login
        </Typography>
        {/* Test login info moved below header */}
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: 'rgba(33,150,243,0.08)',
            borderRadius: 3,
            fontSize: 15,
            textAlign: 'center',
            color: '#1976d2',
            maxWidth: 420,
            width: '100%',
            boxShadow: '0 2px 12px 0 rgba(33,150,243,0.10)',
            fontWeight: 500,
            letterSpacing: 0.2,
          }}
        >
          Test login: <strong>admin@pastas.lt</strong> / <strong>slaptazodis123</strong>
        </Box>
        <TextField
          name="email"
          label="E-mail"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          autoComplete="off"
          sx={{ borderRadius: 2, bgcolor: '#f8fafc' }}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          autoComplete="off"
          sx={{ borderRadius: 2, bgcolor: '#f8fafc' }}
        />
        {error && (
          <Typography color="error" align="center" sx={{ mt: 1, mb: 1, fontWeight: 600, fontSize: 15 }}>{error}</Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{
            mt: 2,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 1,
            boxShadow: '0 4px 16px 0 rgba(33,150,243,0.10)',
            textTransform: 'none',
            py: 1.5,
            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
            color: '#fff',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
            },
          }}
        >
          {loading ? 'Jungiamasi...' : 'Prisijungti'}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
