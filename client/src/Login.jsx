import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', form);
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="p-8 rounded-lg shadow-lg max-w-md w-full bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2 p-2 bg-blue-100 rounded text-sm text-blue-900">
            For testing: <strong>admin@pastas.lt</strong> / <strong>slaptazodis123</strong>
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {error && <div className="mb-2 p-3 bg-red-100 rounded text-red-700 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full p-3 rounded bg-blue-600 text-white text-base font-bold flex items-center justify-center transition hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
