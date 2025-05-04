import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/api';
import './Auth.css';

export default function ResetPassword() {
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError]     = useState('');
  const [info, setInfo]       = useState('');
  const navigate = useNavigate();
  const params   = new URLSearchParams(useLocation().search);
  const token    = params.get('token');

  useEffect(() => {
    if (!token) {
      setError('No reset token provided.');
    }
  }, [token]);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    if (newPass !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const { data } = await resetPassword({ token, newPassword: newPass });
      setInfo(data.message || 'Password has been reset.');
      // After a short delay, send back to login
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // If no token, just show the error
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
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
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
