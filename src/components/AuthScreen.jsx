import React, { useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AuthScreen.css';

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const fn = mode === 'login' ? apiLogin : apiRegister;
      const { data } = await fn({ fullName, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setError('That email is already registered.');
      } else if (status === 400) {
        setError('Invalid credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image"></div>
      <div className="auth-form-container">
        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="submit-button">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
