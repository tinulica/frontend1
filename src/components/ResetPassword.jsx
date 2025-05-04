// src/components/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { forgotPassword, resetPassword } from '../services/api';
import { useLocation } from 'react-router-dom';
import './Auth.css';

export default function ResetPassword({ onClose }) {
  const [mode, setMode] = useState('forgot'); // 'forgot' or 'reset'
  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const params = new URLSearchParams(useLocation().search);
  const token = params.get('token');

  // If the URL has a token param, switch to reset mode
  useEffect(() => {
    if (token) setMode('reset');
  }, [token]);

  const handleForgot = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await forgotPassword({ email });
      setInfo(data.message || 'Check your inbox for a reset link.');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleReset = async e => {
    e.preventDefault();
    setError('');
    if (newPass !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await resetPassword({ token, newPassword: newPass });
      setInfo(data.message || 'Password has been reset.');
      // auto‑close after a moment
      setTimeout(onClose, 2500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>

        {mode === 'forgot' ? (
          <form onSubmit={handleForgot}>
            <h2>Forgot Password</h2>
            {info && <p className="info-message">{info}</p>}
            {!info && (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">
                  Send Reset Link
                </button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <h2>Reset Password</h2>
            {info && <p className="info-message">{info}</p>}
            {!info && (
              <>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
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
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
