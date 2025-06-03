import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ minHeight: '60vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)', padding: '24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', padding: 32 }}>
        <Typography variant="h4" align="center" fontWeight={700} mb={4} color="primary">Account List</Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
          {accounts.map(acc => (
            <Card key={acc._id} style={{ borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(60,80,120,0.10)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>{acc.firstName} {acc.lastName}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>Account: <span style={{ fontFamily: 'monospace' }}>{acc.accountNumber}</span></Typography>
                <Typography variant="h6" color="success.main" fontWeight={700} gutterBottom>Balance: {acc.balance.toFixed(2)} €</Typography>
              </CardContent>
              <CardActions style={{ display: 'flex', gap: 8, justifyContent: 'space-between', padding: 16 }}>
                <Button variant="contained" color="error" onClick={() => handleDelete(acc._id)} style={{ flex: 1, fontWeight: 700, borderRadius: 8 }}>Delete</Button>
                <Button variant="contained" color="success" onClick={() => setFundsAction({id: acc._id, type: 'add'})} style={{ flex: 1, fontWeight: 700, borderRadius: 8 }}>Add Funds</Button>
                <Button variant="contained" color="warning" onClick={() => setFundsAction({id: acc._id, type: 'withdraw'})} style={{ flex: 1, fontWeight: 700, borderRadius: 8 }}>Withdraw</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountList;
