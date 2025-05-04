import React, { useState } from 'react';
import { forgotPassword } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <main className="auth-container">
      <h2>Forgot Password</h2>
      {message && <p className="info-message">{message}</p>}
      <form onSubmit={onSubmit}>
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
      </form>
      <button
        className="link-button"
        onClick={() => navigate('/login')}
      >
        Back to Login
      </button>
    </main>
  );
}
