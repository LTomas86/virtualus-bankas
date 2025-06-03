import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import UserRegister from './UserRegister';
import AccountList from './AccountList';
import AccountCreate from './AccountCreate';
import Button from '@mui/material/Button';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const navigate = useNavigate();

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/accounts');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) {
    return (
      <Routes>
        <Route path="/register" element={<UserRegister />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <header style={{
          width: '100%',
          background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
          color: '#fff',
          padding: '16px 0 10px 0', // sumažintas padding
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0 4px 24px 0 rgba(60,80,120,0.10)',
          marginBottom: 24, // sumažintas tarpas apačioje
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: 56 // sumažintas aukštis
        }}>
          <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: 1, textShadow: '0 2px 8px rgba(60,80,120,0.10)' }}>
            Banking System
          </span>
          <span style={{ position: 'absolute', right: 32, top: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{user?.name}</span>
            <button onClick={handleLogout} style={{ padding: '6px 14px', borderRadius: 8, background: '#e53935', color: '#fff', fontWeight: 700, border: 'none', fontSize: 14, boxShadow: '0 2px 8px 0 rgba(229,57,53,0.10)', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#b71c1c'}
              onMouseOut={e => e.currentTarget.style.background = '#e53935'}
            >Logout</button>
          </span>
        </header>
        <Routes>
          <Route path="/accounts" element={<AccountList token={token} />} />
          <Route path="/create" element={<AccountCreate token={token} onCreated={() => navigate('/accounts')} />} />
          <Route path="*" element={<AccountList token={token} />} />
        </Routes>
        <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 100 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<span style={{ fontSize: 28, lineHeight: 1 }}>＋</span>}
            style={{
              borderRadius: 50,
              fontWeight: 700,
              fontSize: 20,
              padding: '18px 36px',
              boxShadow: '0 8px 32px 0 rgba(60,80,120,0.18)',
              letterSpacing: 1.5,
              textTransform: 'none',
              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
              color: '#fff',
              transition: 'all 0.3s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'}
            onClick={() => navigate('/create')}
          >
            New Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
