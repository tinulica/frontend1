import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { saveAuth } from '../utils/auth';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const nav = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { fullName, email, password });
      saveAuth(data);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Full Name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <nav>
        <Link to="/login">Already have an account? Log in</Link>
      </nav>
    </div>
  );
}
