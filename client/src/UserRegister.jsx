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
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const UserRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', photo: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false); // hide message when changing field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await axios.post('http://localhost:3000/api/users', form);
      setForm({ name: '', email: '', password: '', photo: '' });
      setSuccess(true);
    } catch (err) {
      // Error handling can be added here if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, maxWidth: 500, width: '100%' }}>
        <Typography variant="h5" align="center" color="primary.main" fontWeight={700} mb={3}>
          Register User
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            autoComplete="off"
          />
          <TextField
            name="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
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
            autoComplete="off"
          />
          <TextField
            name="photo"
            label="Photo URL"
            value={form.photo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, borderRadius: 2, fontWeight: 700, letterSpacing: 1 }}
            startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <PersonAddAlt1Icon />}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Register'}
          </Button>
          {success && (
            <Alert severity="success" sx={{ mt: 3, textAlign: 'center' }}>Registration successful!</Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserRegister;