// src/components/AuthScreen.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthScreen.css';

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, login: contextLogin, register: contextRegister, logout } = useContext(AuthContext);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await contextLogin(email, password);
      } else {
        await contextRegister(fullName, email, password);
      }
      // contextLogin/Register handles navigation
    } catch (err) {
      // context throws errors with message
      setError(err.message);
    }
  };

  const handleTabClick = (newMode) => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="auth-container">
      <div className="auth-image" aria-hidden="true"></div>
      <div className="auth-form-container">
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            id="tab-login"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'active' : ''}
            onClick={() => handleTabClick('login')}
          >
            Login
          </button>
          <button
            role="tab"
            id="tab-register"
            aria-selected={mode === 'register'}
            className={mode === 'register' ? 'active' : ''}
            onClick={() => handleTabClick('register')}
          >
            Register
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          aria-labelledby={mode === 'login' ? 'tab-login' : 'tab-register'}
        >
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error" role="alert">{error}</div>}
          <button type="submit" className="submit-button">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
