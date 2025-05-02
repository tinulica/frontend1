// src/components/InvitationModal.jsx
import React, { useState } from 'react';
import { sendInvitation } from '../services/api';

const backdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
  background: '#fff', padding: '2rem', borderRadius: '8px',
  width: '90%', maxWidth: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};
const formGroupStyle = { marginBottom: '1rem', display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.5rem', color: '#333', fontWeight: 500 };
const inputStyle = { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' };
const buttonStyle = { padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const submitStyle = { ...buttonStyle, background: '#4f46e5', color: '#fff' };
const cancelStyle = { ...buttonStyle, background: '#6b7280', color: '#fff' };
const errorStyle = { color: '#dc2626', margin: '0.5rem 0', textAlign: 'center' };

export default function InvitationModal({ isOpen, onClose, onSent }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendInvitation({ invitedEmail: email });
      setEmail('');
      onSent();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2>Invite Employee</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="inviteEmail" style={labelStyle}>Email Address</label>
            <input
              id="inviteEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          {error && <p style={errorStyle}>{error}</p>}
          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelStyle} disabled={loading}>
              Cancel
            </button>
            <button type="submit" style={submitStyle} disabled={loading}>
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
