import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountFunds from './AccountFunds';

const AccountList = ({ token }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundsAction, setFundsAction] = useState(null); // {id, type}

  const fetchAccounts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3000/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(accounts.filter(acc => acc._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete');
    }
  };

  if (fundsAction) {
    return <AccountFunds token={token} accountId={fundsAction.id} type={fundsAction.type} onDone={() => { setFundsAction(null); fetchAccounts(); }} />;
  }

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh"><CircularProgress color="success" /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Typography variant="h4" align="center" color="success.main" fontWeight={700} mb={4} letterSpacing={1}>
        Account List
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {accounts.map(acc => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={acc._id}>
            <Card sx={{ borderTop: 4, borderColor: 'success.main', borderRadius: 3, boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'success.main', fontWeight: 700 }}>
                    {acc.firstName[0]}{acc.lastName[0]}
                  </Avatar>
                }
                title={<Typography fontWeight={600} color="success.main">{acc.firstName} {acc.lastName}</Typography>}
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1, pb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Account:
                  <Box component="span" fontWeight={600} ml={1} sx={{ wordBreak: 'break-all' }}>{acc.accountNumber}</Box>
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Typography variant="body2">Balance:</Typography>
                  <Chip label={acc.balance.toFixed(2) + ' €'} color="success" size="medium" sx={{ fontSize: 16, fontWeight: 700 }} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(acc._id)}
                    fullWidth
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setFundsAction({id: acc._id, type: 'add'})}
                    fullWidth
                  >
                    Add Funds
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<RemoveCircleIcon />}
                    onClick={() => setFundsAction({id: acc._id, type: 'withdraw'})}
                    fullWidth
                  >
                    Withdraw
                  </Button>
                </Stack>
              </CardContent>
              <Box sx={{ px: 2, pb: 1, pt: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <AccessTimeIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">Updated</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccountList;
