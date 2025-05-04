// src/components/ForgotPasswordModal.jsx
import { useState } from 'react';
import { forgotPassword } from '../services/api';
import './ForgotPasswordModal.css';

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo]   = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await forgotPassword({ email });
      setInfo(data.message || 'If that address exists, we’ve sent reset instructions.');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>Forgot Password</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </header>
        {info ? (
          <p className="info-message">{info}</p>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Your email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}
