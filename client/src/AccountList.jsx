import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div style={{ padding: '16px' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '32px' }}>
        Account List
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {accounts.map(acc => (
          <div key={acc._id} style={{ border: '1px solid #ccc', borderRadius: '8px', margin: '8px', padding: '16px', width: 'calc(25% - 32px)', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 600 }}>
                {acc.firstName} {acc.lastName}
              </div>
              <div style={{ color: '#666' }}>
                Account:
                <span style={{ fontWeight: 600, marginLeft: '4px' }}>{acc.accountNumber}</span>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span>Balance:</span>
              <strong style={{ marginLeft: '4px' }}>{acc.balance.toFixed(2)} €</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handleDelete(acc._id)}
                style={{ backgroundColor: '#f44336', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
              <button
                onClick={() => setFundsAction({id: acc._id, type: 'add'})}
                style={{ backgroundColor: '#4caf50', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Add Funds
              </button>
              <button
                onClick={() => setFundsAction({id: acc._id, type: 'withdraw'})}
                style={{ backgroundColor: '#ff9800', color: 'white', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
