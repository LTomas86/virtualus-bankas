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
      <nav>
        <div>
          <span>Banking System</span>
          <span>
            {user?.name} <button onClick={handleLogout}>Logout</button>
          </span>
        </div>
      </nav>
      <Routes>
        <Route path="/accounts" element={<AccountList token={token} />} />
        <Route path="/create" element={<AccountCreate token={token} onCreated={() => navigate('/accounts')} />} />
        <Route path="*" element={<AccountList token={token} />} />
      </Routes>
      <div>
        <button
          onClick={() => navigate('/create')}
        >
          New Account
        </button>
      </div>
    </>
  );
}

export default App;
