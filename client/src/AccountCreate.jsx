import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountCreate = ({ token, onCreated }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    personalId: '',
    passportPhoto: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setError('');
    setSuccess('');
    if (f) {
      setForm(prev => ({ ...prev, passportPhoto: '' })); // išvalo input laukelį
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:3000/api/accounts', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Account created!');
      setForm({ firstName: '', lastName: '', personalId: '', passportPhoto: '' });
      setPreview(null);
      if (onCreated) onCreated();
    } catch (err) {
      let details = '';
      if (err.response?.data?.error) details = ` (details: ${err.response.data.error})`;
      setError((err.response?.data?.message || 'Error creating account') + details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Account</h2>
      <div>
        <label>First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Personal ID</label>
        <input
          name="personalId"
          value={form.personalId}
          onChange={handleChange}
          required
          maxLength={11}
          minLength={11}
        />
        <small>11 digits, e.g. 39912319999</small>
      </div>
      <div>
        <label>Passport copy URL</label>
        <input
          name="passportPhoto"
          value={form.passportPhoto}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Upload Passport Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {preview && (
        <div>
          <img src={preview} alt="Preview" style={{ width: 80, height: 80 }} />
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </form>
  );
};

export default AccountCreate;
