import React, { useState } from 'react';
import { requestReset }       from '../services/api';
import './ForgotPasswordModal.css';

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [info, setInfo]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);
    try {
      const { data } = await requestReset({ email });
      setInfo(data.message || 'Check your inbox for reset instructions.');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fp-backdrop" onClick={onClose}>
      <div className="fp-modal" onClick={e => e.stopPropagation()}>
        <button className="fp-close" onClick={onClose}>×</button>
        <h2>Forgot Password</h2>
        {info ? (
          <p className="fp-info">{info}</p>
        ) : (
          <form onSubmit={handleSubmit} className="fp-form">
            <label htmlFor="fp-email">Your email address</label>
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
            {error && <p className="fp-error">{error}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
