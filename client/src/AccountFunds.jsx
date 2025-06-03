import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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

  if (!account) return <div>Loading...</div>;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Box sx={{ p: 4, borderRadius: 4, boxShadow: 3, bgcolor: '#fff', width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary">
          {type === 'add' ? 'Add Funds' : 'Withdraw Funds'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="body1" mb={1}>
            Owner: <strong>{account.firstName} {account.lastName}</strong>
          </Typography>
          <Typography variant="body1" mb={2}>
            Account balance: <strong>{account.balance.toFixed(2)} €</strong>
          </Typography>
          <TextField
            type="number"
            min={0.01}
            step={0.01}
            label="Amount (€)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
          {success && <Typography color="success.main" align="center" sx={{ mt: 2 }}>{success}</Typography>}
          <Box display="flex" gap={2} mt={3}>
            <Button
              type="submit"
              variant="contained"
              color={type === 'add' ? 'success' : 'warning'}
              fullWidth
              disabled={loading}
              sx={{ fontWeight: 700, fontSize: 18, borderRadius: 2 }}
            >
              {loading ? 'Processing...' : (type === 'add' ? 'Add' : 'Withdraw')}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ fontWeight: 700, fontSize: 18, borderRadius: 2 }}
              onClick={onDone}
            >
              Back
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AccountFunds;
