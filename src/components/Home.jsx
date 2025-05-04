import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Home.css';
import illustration from '../assets/auth-illustration.png';

export default function Home() {
  const [mode, setMode]         = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const { login, register }     = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(fullName, email, password);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Something went wrong'
      );
    }
  };

  return (
    <div className="home-container">
      <div className="auth-card">
        <div
          className="auth-left"
          style={{ backgroundImage: `url(${illustration})` }}
        />
        <div className="auth-right">
          <div className="auth-tabs">
            <button
              className={mode === 'login' ? 'tab active' : 'tab'}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={mode === 'register' ? 'tab active' : 'tab'}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            {mode === 'login' ? (
              <>Don’t have an account?{' '}
                <button
                  className="switch-btn"
                  onClick={() => setMode('register')}
                >
                  Register
                </button>
              </>
            ) : (
              <>Already have one?{' '}
                <button
                  className="switch-btn"
                  onClick={() => setMode('login')}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
