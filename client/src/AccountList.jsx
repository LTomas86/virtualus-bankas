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
  const [fundsAction, setFundsAction] = useState(null);
  const [modalPhoto, setModalPhoto] = useState(null); // modal nuotraukai

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
    <>
      {modalPhoto && (
        <div
          onClick={() => setModalPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={modalPhoto}
            alt="passport enlarged"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 8,
              boxShadow: '0 8px 32px 0 rgba(60,80,120,0.18)',
              background: '#fff',
            }}
          />
        </div>
      )}
      <div className="account-list-container" style={{ padding: 24, background: '#f6f7fb', borderRadius: 18, boxShadow: '0 4px 32px 0 rgba(60,80,120,0.10)' }}>
        <Typography variant="h4" align="center" fontWeight={700} mb={4} color="primary">Account List</Typography>
        <div className="account-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
          {accounts.map(acc => (
            <Card key={acc._id} sx={{ borderRadius: 4, border: '1.5px solid #e0e0e0', boxShadow: '0 6px 24px 0 rgba(60,80,120,0.10)', transition: 'box-shadow 0.2s, border 0.2s', '&:hover': { boxShadow: '0 12px 32px 0 rgba(60,80,120,0.18)', border: '1.5px solid #1976d2' }, minHeight: 180 }}>
              <CardContent>
                {acc.passportPhoto && (
                  <img
                    src={acc.passportPhoto?.startsWith('/uploads/') ? `http://localhost:3000${acc.passportPhoto}` : acc.passportPhoto}
                    alt="passport"
                    style={{
                      height: 28,
                      borderRadius: 3,
                      border: '1px solid #eee',
                      marginBottom: 6,
                      display: 'block',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setModalPhoto(acc.passportPhoto?.startsWith('/uploads/') ? `http://localhost:3000${acc.passportPhoto}` : acc.passportPhoto)}
                    title="Click to enlarge"
                  />
                )}
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>{acc.firstName} {acc.lastName}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>Account: <span style={{ fontFamily: 'monospace' }}>{acc.accountNumber}</span></Typography>
                <Typography variant="subtitle1" color="success.main" fontWeight={700} gutterBottom>Balance: {acc.balance.toFixed(2)} €</Typography>
              </CardContent>
              <CardActions sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(acc._id)}
                  sx={{
                    flex: 1,
                    fontWeight: 700,
                    borderRadius: 2,
                    minWidth: 0,
                    minHeight: 38,
                    fontSize: 15,
                    letterSpacing: 0.5,
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: '0 2px 8px 0 rgba(229,57,53,0.12)',
                    background: 'linear-gradient(90deg, #ff1744 0%, #d50000 100%)',
                    color: '#fff',
                    width: '100%'
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setFundsAction({id: acc._id, type: 'add'})}
                  sx={{
                    flex: 1,
                    fontWeight: 700,
                    borderRadius: 2,
                    minWidth: 0,
                    minHeight: 38,
                    fontSize: 15,
                    letterSpacing: 0.5,
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: '0 2px 8px 0 rgba(67,233,123,0.12)',
                    background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                    color: '#fff',
                    width: '100%'
                  }}
                >
                  Add Funds
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => setFundsAction({id: acc._id, type: 'withdraw'})}
                  sx={{
                    flex: 1,
                    fontWeight: 700,
                    borderRadius: 2,
                    minWidth: 0,
                    minHeight: 38,
                    fontSize: 15,
                    letterSpacing: 0.5,
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: '0 2px 8px 0 rgba(255,160,0,0.12)',
                    background: 'linear-gradient(90deg, #ff9800 0%, #ff6d00 100%)',
                    color: '#fff',
                    width: '100%'
                  }}
                >
                  Withdraw
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default AccountList;
