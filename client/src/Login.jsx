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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Box sx={{ mb: 2, p: 1, bgcolor: '#e8f0fe', borderRadius: 2, fontSize: 14, textAlign: 'center', color: '#1976d2', maxWidth: 400, width: '100%' }}>
        Test login: <strong>admin@pastas.lt</strong> / <strong>slaptazodis123</strong>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4, boxShadow: 3, bgcolor: '#fff', width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary">Login</Typography>
        <TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} fullWidth required margin="normal" autoComplete="off" />
        <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} fullWidth required margin="normal" autoComplete="off" />
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>
        )}
        <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 3, borderRadius: 2, fontWeight: 700, fontSize: 18 }}>{loading ? 'Logging in...' : 'Login'}</Button>
      </Box>
    </Box>
  );
};

export default Login;
