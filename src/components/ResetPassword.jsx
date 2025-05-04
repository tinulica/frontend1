// src/components/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/api';
import './Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get('token');

  const [newPass, setNewPass]     = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [info, setInfo]           = useState('');

  // if they visit without a token
  useEffect(() => {
    if (!token) {
      setError('No reset token provided.');
    }
  }, [token]);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');

    // client‑side match check
    if (newPass !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data } = await resetPassword({ token, newPassword: newPass });
      setInfo(data.message || 'Password has been reset!');
      // auto‑redirect back to login after a short pause
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // no token → just show the message
  if (error && !token) {
    return (
      <main className="auth-container">
        <h2>Reset Password</h2>
        <p className="error-message">{error}</p>
      </main>
    );
  }

  return (
    <main className="auth-container">
      <h2>Reset Password</h2>

      {info ? (
        <p className="info-message">{info}</p>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="newPass">New Password</label>
            <input
              id="newPass"
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>
      )}
    </main>
  );
}
