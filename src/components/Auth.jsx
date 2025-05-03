// src/components/Auth.js
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { register as apiRegister } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Auth({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(null);
  const [info,     setInfo]     = useState('');

  // If we were redirected here after register, show that banner
  useEffect(() => {
    if (location.state?.success) {
      setInfo(location.state.success);
    }
  }, [location.state]);

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    setInfo('');

    try {
      if (mode === 'register') {
        await apiRegister({ fullName, email, password });
        navigate('/auth?mode=login', {
          state: { success: '🎉 Registration successful! Please log in.' }
        });
      } else {
        // login via context will store token & user and nav to /dashboard
        await contextLogin(email, password);
      }
    } catch (err) {
      const status  = err.response?.status;
      const msg     = err.response?.data?.message || err.message;

      if (mode === 'register') {
        if (status === 409) setError('That email is already registered. Please log in.');
        else setError(msg || 'Registration failed. Try again later.');
      } else {
        if (status === 400 || status === 401) setError('Email or password is incorrect.');
        else setError(msg || 'Login failed. Try again later.');
      }
    }
  };

  return (
    <main className="auth-container">
      <h2>{mode === 'register' ? 'Create an Account' : 'Welcome Back'}</h2>
      {info && <p className="info-message">{info}</p>}
      <form onSubmit={onSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your full name"
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
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <button type="submit" className="submit-button">
          {mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>
    </main>
  );
}
