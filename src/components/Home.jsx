import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';
import illustration from '../assets/auth-illustration.png';

export default function Home() {
  const { login, register } = useContext(AuthContext);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const inviteToken = params.get('token') || '';

  const [mode, setMode] = useState(inviteToken ? 'register' : 'login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (inviteToken) {
      setMode('register');
      setError('');
    }
  }, [inviteToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ fullName, email, password, token: inviteToken });
        if (inviteToken) {
          setMode('login');
          setError('Registration successful! Please sign in.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="dribbble-login-container">
      <div className="dribbble-login-card">
        <div className="dribbble-login-left">
          <h1 className="dribbble-login-title">Welcome Back 👋</h1>
          <p className="dribbble-login-subtext">Log in or create an account to continue managing your organization.</p>

          {error && <div className="dribbble-auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="dribbble-login-form">
            {mode === 'register' && (
              <div className="dribbble-form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="dribbble-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="dribbble-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="dribbble-submit-btn">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="dribbble-switch-mode">
            {mode === 'login' ? (
              <>
                Don’t have an account?
                <button onClick={() => { setMode('register'); setError(''); }}> Register</button>
              </>
            ) : (
              <>
                Already have an account?
                <button onClick={() => { setMode('login'); setError(''); }}> Sign In</button>
              </>
            )}
          </div>
        </div>
        <div className="dribbble-login-right" style={{ backgroundImage: `url(${illustration})` }}></div>
      </div>
    </div>
  );
}
