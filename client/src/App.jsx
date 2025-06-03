import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import UserRegister from './UserRegister';
import AccountList from './AccountList';
import AccountCreate from './AccountCreate';

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
    <>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', marginBottom: 32, padding: '0.5rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
          <span style={{ fontWeight: 700, fontSize: 22, color: '#1976d2', letterSpacing: 1 }}>Banking System</span>
          <span>
            {user?.name} <button style={{ marginLeft: 12 }} className="MuiButton-root MuiButton-outlined MuiButton-sizeSmall MuiButton-colorError" onClick={handleLogout}>Logout</button>
          </span>
        </div>
      </nav>
      <Routes>
        <Route path="/accounts" element={<AccountList token={token} />} />
        <Route path="/create" element={<AccountCreate token={token} onCreated={() => navigate('/accounts')} />} />
        <Route path="*" element={<AccountList token={token} />} />
      </Routes>
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 100 }}>
        <button
          className="MuiButton-root MuiButton-contained MuiButton-sizeLarge MuiButton-colorSuccess"
          style={{ borderRadius: 50, fontWeight: 700, fontSize: 18, padding: '12px 28px', boxShadow: '0 4px 24px 0 rgba(60,80,120,0.10)' }}
          onClick={() => navigate('/create')}
        >
          New Account
        </button>
      </div>
    </>
  );
}

export default App;
