import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Alert, CircularProgress, Avatar } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const AccountCreate = ({ token, onCreated }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    personalId: '',
    passportPhoto: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setError('');
    setSuccess('');
    if (f) {
      setForm(prev => ({ ...prev, passportPhoto: '' })); // išvalo input laukelį
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:3000/api/accounts', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Account created!');
      setForm({ firstName: '', lastName: '', personalId: '', passportPhoto: '' });
      setPreview(null);
      if (onCreated) onCreated();
    } catch (err) {
      let details = '';
      if (err.response?.data?.error) details = ` (details: ${err.response.data.error})`;
      setError((err.response?.data?.message || 'Error creating account') + details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Box component="form" onSubmit={handleSubmit} sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        bgcolor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        width: '100%',
        maxWidth: 400,
        position: 'relative',
      }}>
        <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, position: 'absolute', left: '50%', top: -32, transform: 'translateX(-50%)', boxShadow: 2, border: '4px solid #fff' }}>
          <PersonAddAlt1Icon sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography variant="h5" align="center" color="success.main" fontWeight={700} mt={6} mb={3} letterSpacing={1}>
          New Account
        </Typography>
        <TextField
          name="firstName"
          label="First Name"
          value={form.firstName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          size="large"
          autoComplete="off"
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={form.lastName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          size="large"
          autoComplete="off"
        />
        <TextField
          name="personalId"
          label="Personal ID"
          value={form.personalId}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          size="large"
          inputProps={{ maxLength: 11, minLength: 11 }}
          helperText="11 digits, e.g. 39912319999"
          autoComplete="off"
        />
        <TextField
          name="passportPhoto"
          label="Passport copy URL"
          value={form.passportPhoto}
          onChange={handleChange}
          fullWidth
          margin="normal"
          size="large"
          autoComplete="off"
        />
        <Button
          variant="outlined"
          component="label"
          size="small"
          sx={{ mt: 1, mb: 1 }}
        >
          Uploud Passport Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {preview && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Avatar src={preview} alt="Preview" sx={{ width: 80, height: 80 }} />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>
        )}
        {success && (
          <Alert icon={<CheckCircleIcon fontSize="inherit" color="success" />} severity="success" sx={{ mt: 2, borderRadius: 2 }}>{success}</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="success"
          size="large"
          fullWidth
          sx={{
            mt: 3,
            borderRadius: 8,
            fontWeight: 700,
            letterSpacing: 1,
            fontSize: 18,
            background: 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)',
            color: '#fff',
            boxShadow: '0 4px 24px 0 rgba(123,47,242,0.15)',
            transition: 'background 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg, #f357a8 0%, #7b2ff2 100%)',
              color: '#fff',
            }
          }}
          startIcon={loading ? <CircularProgress size={22} color="inherit" /> : <CheckCircleIcon />}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Account'}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            borderRadius: 8,
            fontWeight: 700,
            letterSpacing: 1,
            fontSize: 18,
            borderWidth: 2,
            borderColor: 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)',
            background: 'linear-gradient(90deg, #f5f7fa 0%, #e2e6ef 100%)',
            color: '#7b2ff2',
            boxShadow: '0 2px 12px 0 rgba(123,47,242,0.08)',
            transition: 'all 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg, #f357a8 0%, #7b2ff2 100%)',
              color: '#fff',
              borderColor: '#f357a8',
              boxShadow: '0 4px 24px 0 rgba(123,47,242,0.15)'
            }
          }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
      </Box>
    </Box>
  );
};

export default AccountCreate;
