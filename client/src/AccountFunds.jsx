import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AccountFunds = ({ token, accountId, type, onDone }) => {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/accounts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const acc = res.data.find(a => a._id === accountId);
        setAccount(acc);
      } catch {
        setError('Failed to fetch account data');
      }
    };
    fetchAccount();
  }, [accountId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.patch(`http://localhost:3000/api/accounts/${accountId}/${type === 'add' ? 'add' : 'withdraw'}`,
        { amount: Number(amount) },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess(type === 'add' ? 'Funds added!' : 'Funds withdrawn!');
      setAmount('');
      if (onDone) onDone();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (!account) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh"><CircularProgress color={type === 'add' ? 'success' : 'warning'} /></Box>;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      mt: 4,
      p: { xs: 2, md: 4 },
      borderRadius: 4,
      boxShadow: 3,
      bgcolor: 'background.paper',
      maxWidth: 500,
      mx: 'auto',
    }}>
      <Typography variant="h5" align="center" color={type === 'add' ? 'success.main' : 'warning.main'} fontWeight={700} mb={3}>
        {type === 'add' ? 'Add Funds' : 'Withdraw Funds'}
      </Typography>
      <Typography mb={1}>Owner: <b>{account.firstName} {account.lastName}</b></Typography>
      <Typography mb={2}>Account balance: <Chip label={account.balance.toFixed(2) + ' €'} color="success" size="medium" sx={{ fontSize: 16, fontWeight: 700 }} /></Typography>
      <TextField
        type="number"
        min={0.01}
        step={0.01}
        label="Amount (€)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        fullWidth
        size="large"
        margin="normal"
        inputProps={{ min: 0.01, step: 0.01 }}
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={3}>
        <Button
          type="submit"
          variant="contained"
          color={type === 'add' ? 'success' : 'warning'}
          size="large"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Processing...' : (type === 'add' ? 'Add' : 'Withdraw')}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          size="large"
          fullWidth
          startIcon={<ArrowBackIcon />}
          onClick={onDone}
        >
          Back
        </Button>
      </Stack>
    </Box>
  );
};

export default AccountFunds;
