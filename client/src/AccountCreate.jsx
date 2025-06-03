import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4, boxShadow: 3, bgcolor: '#fff', width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary">New Account</Typography>
        <TextField name="firstName" label="First Name" value={form.firstName} onChange={handleChange} fullWidth required margin="normal" autoComplete="off" />
        <TextField name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} fullWidth required margin="normal" autoComplete="off" />
        <TextField name="personalId" label="Personal ID" value={form.personalId} onChange={handleChange} fullWidth required margin="normal" inputProps={{ maxLength: 11, minLength: 11 }} helperText="11 digits, e.g. 39912319999" autoComplete="off" />
        <TextField name="passportPhoto" label="Passport copy URL" value={form.passportPhoto} onChange={handleChange} fullWidth margin="normal" autoComplete="off" />
        <Box display="flex" alignItems="center" gap={2} mt={2} mb={2}>
          <Button
            variant="outlined"
            component="label"
            color="primary"
            sx={{ minWidth: 0, fontWeight: 600, fontSize: 15, borderRadius: 2 }}
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {preview && (
            <img src={preview} alt="Preview" style={{ height: 40, borderRadius: 4, border: '1px solid #eee' }} />
          )}
          {file && (
            <Typography variant="body2" color="text.secondary">{file.name}</Typography>
          )}
        </Box>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>
        )}
        <Button type="submit" variant="contained" color="success" size="large" fullWidth sx={{ mt: 3, borderRadius: 2, fontWeight: 700, fontSize: 18 }}>Create Account</Button>
        <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: 18 }} onClick={() => navigate(-1)}>← Back</Button>
      </Box>
    </Box>
  );
};

export default AccountCreate;
