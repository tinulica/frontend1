import React, { useState } from 'react';
import Auth from './Auth';
import './Home.css';

export default function Home() {
  const [mode, setMode] = useState('login');

  return (
    <main className="home-container">
      <div className="home-content">
        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'tab active' : 'tab'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'tab active' : 'tab'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        <div className="auth-card">
          <Auth mode={mode} />
        </div>
      </div>
    </main>
  );
}
