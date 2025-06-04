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

  // Sort accounts by last name (pavardė)
  const sortedAccounts = [...accounts].sort((a, b) => {
    if (!a.lastName) return 1;
    if (!b.lastName) return -1;
    return a.lastName.localeCompare(b.lastName, 'lt', { sensitivity: 'base' });
  });

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

  // Inline stiliai
  const styles = {
    root: {
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      background: '#f8f9fa',
      color: '#222',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
    },
    cardContainer: {
      padding: 24,
      background: '#f6f7fb',
      borderRadius: 18,
      boxShadow: '0 4px 32px 0 rgba(60,80,120,0.10)',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: 32,
    },
    card: {
      borderRadius: 10,
      boxShadow: '0 2px 8px 0 rgba(60,80,120,0.06)',
      border: '1px solid #e5e7eb',
      background: '#fff',
      minHeight: 180,
      transition: 'box-shadow 0.2s, border 0.2s',
    },
    cardHover: {
      boxShadow: '0 12px 32px 0 rgba(60,80,120,0.18)',
      border: '1.5px solid #1976d2',
    },
    modalOverlay: {
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
    },
    modalImg: {
      maxWidth: '90vw',
      maxHeight: '90vh',
      borderRadius: 8,
      boxShadow: '0 8px 32px 0 rgba(60,80,120,0.18)',
      background: '#fff',
    },
    passportImg: {
      height: 28,
      borderRadius: 3,
      border: '1px solid #eee',
      marginBottom: 6,
      display: 'block',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    cardActions: {
      display: 'flex',
      gap: 8,
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 16,
    },
    button: {
      borderRadius: 6,
      fontWeight: 600,
      fontSize: 12,
      boxShadow: 'none',
      textTransform: 'none',
      letterSpacing: 0.2,
      minHeight: 40,
      background: '#222',
      color: '#fff',
      transition: 'background 0.2s',
      flex: 1,
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    buttonHover: {
      background: '#444',
    },
  };

  return (
    <div style={styles.root}>
      {modalPhoto && (
        <div
          onClick={() => setModalPhoto(null)}
          style={styles.modalOverlay}
        >
          <img
            src={modalPhoto}
            alt="passport enlarged"
            style={styles.modalImg}
          />
        </div>
      )}
      <div className="account-list-container" style={styles.cardContainer}>
        <Typography variant="h4" align="center" fontWeight={700} mb={4} color="primary">Account List</Typography>
        <div className="account-list" style={styles.cardGrid}>
          {sortedAccounts.map(acc => (
            <Card key={acc._id} style={styles.card}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  {/* Avatar su inicialais */}
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#e0e3e7',
                    color: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: 1,
                    userSelect: 'none',
                    flexShrink: 0
                  }}>
                    {acc.firstName?.[0]?.toUpperCase()}{acc.lastName?.[0]?.toUpperCase()}
                  </div>
                  <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom style={{margin: 0}}>
                    {acc.firstName} {acc.lastName}
                  </Typography>
                </div>
                {/* Nuotrauka jei yra */}
                {acc.passportPhoto && (
                  <img
                    src={acc.passportPhoto?.startsWith('/uploads/') ? `http://localhost:3000${acc.passportPhoto}` : acc.passportPhoto}
                    alt="passport"
                    style={styles.passportImg}
                    onClick={() => setModalPhoto(acc.passportPhoto?.startsWith('/uploads/') ? `http://localhost:3000${acc.passportPhoto}` : acc.passportPhoto)}
                    title="Click to enlarge"
                  />
                )}
                <Typography variant="body2" color="text.secondary" gutterBottom>Account: <span style={{ fontFamily: 'monospace' }}>{acc.accountNumber}</span></Typography>
                <Typography variant="subtitle1" color="success.main" fontWeight={700} gutterBottom>Balance: {acc.balance.toFixed(2)} €</Typography>
              </CardContent>
              <CardActions style={styles.cardActions}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(acc._id)}
                  style={styles.button}
                  onMouseOver={e => e.currentTarget.style.background = styles.buttonHover.background}
                  onMouseOut={e => e.currentTarget.style.background = styles.button.background}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setFundsAction({id: acc._id, type: 'add'})}
                  style={styles.button}
                  onMouseOver={e => e.currentTarget.style.background = styles.buttonHover.background}
                  onMouseOut={e => e.currentTarget.style.background = styles.button.background}
                >
                  Add Funds
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => setFundsAction({id: acc._id, type: 'withdraw'})}
                  style={styles.button}
                  onMouseOver={e => e.currentTarget.style.background = styles.buttonHover.background}
                  onMouseOut={e => e.currentTarget.style.background = styles.button.background}
                >
                  Withdraw
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountList;
