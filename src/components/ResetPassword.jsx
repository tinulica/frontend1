import React, { useState, useEffect } from 'react';
import { resetPassword } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
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
    if (!token) setError('No reset token provided.');
  }, [token]);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    if (newPass !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      const { data } = await resetPassword({ token, newPassword: newPass });
      setInfo(data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

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
      {info && <p className="info-message">{info}</p>}
      {!info && (
        <form onSubmit={onSubmit}>
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
        </form>
      )}
    </main>
  );
}
