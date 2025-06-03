import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <form onSubmit={handleSubmit} style={{
      marginTop: '16px',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '24px' }}>
        {type === 'add' ? 'Add Funds' : 'Withdraw Funds'}
      </h2>
      <p style={{ marginBottom: '8px' }}>Owner: <strong>{account.firstName} {account.lastName}</strong></p>
      <p style={{ marginBottom: '16px' }}>Account balance: <strong>{account.balance.toFixed(2)} €</strong></p>
      <input
        type="number"
        min={0.01}
        step={0.01}
        placeholder="Amount (€)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />
      {error && <div style={{ color: 'red', marginTop: '16px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '16px' }}>{success}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%',
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : (type === 'add' ? 'Add' : 'Withdraw')}
        </button>
        <button
          type="button"
          style={{
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%',
          }}
          onClick={onDone}
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default AccountFunds;
