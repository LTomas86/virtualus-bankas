import React, { useState } from 'react';
import axios from 'axios';

const UserRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', photo: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false); // hide message when changing field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await axios.post('http://localhost:3000/api/users', form);
      setForm({ name: '', email: '', password: '', photo: '' });
      setSuccess(true);
    } catch (err) {
      // you can add error message if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: '1.5rem' }}>
          Register User
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              name="photo"
              placeholder="Photo URL"
              value={form.photo}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Register'}
          </button>
          {success && (
            <div style={{ marginTop: '1rem', textAlign: 'center', color: 'green' }}>
              Registration successful!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserRegister;