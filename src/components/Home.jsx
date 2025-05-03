// src/components/Home.jsx
import React, { useState } from 'react';
import './Home.css';
import illustration from '../assets/auth-illustration.png';

export default function Home() {
  const [mode, setMode] = useState('login');

  return (
    <div className="home-container">
      <div className="auth-card">
        <div
          className="auth-left"
          style={{ backgroundImage: `url(${illustration})` }}
        />
        <div className="auth-right">
          <div className="auth-tabs">
            <div
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </div>
            <div
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </div>
          </div>
          <form className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" className="submit-btn">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          <div className="auth-footer">
            {mode === 'login' ? (
              <>Don’t have an account?{' '}
                <a onClick={() => setMode('register')}>Register</a>
              </>
            ) : (
              <>Already registered?{' '}
                <a onClick={() => setMode('login')}>Login</a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
