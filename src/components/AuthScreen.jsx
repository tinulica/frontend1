// src/components/AuthScreen.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthScreen.css';
import illustration from '../assets/auth-illustration.png';

export default function AuthScreen() {
  const [mode, setMode]       = useState('login'); // or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState(null);

  const navigate = useNavigate();
  const { user, login, register } = useContext(AuthContext);

  // Redirect logged‑in users straight to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(fullName, email, password);
      }
      // AuthContext takes care of navigation
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const switchMode = m => {
    setMode(m);
    setError(null);
  };

  return (
    <div className="auth-screen">
      <div
        className="auth-screen__image"
        style={{ backgroundImage: `url(${illustration})` }}
        aria-hidden="true"
      />
      <div className="auth-screen__form">
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            className={`auth-tab ${mode==='login'?'active':''}`}
            aria-selected={mode==='login'}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            role="tab"
            className={`auth-tab ${mode==='register'?'active':''}`}
            aria-selected={mode==='register'}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="submit-button">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
