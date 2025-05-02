import React, { useState } from 'react';
import './InvitationModal.css';

export default function InvitationModal({ isOpen, onClose, onSent }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await onSent(email);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Invite Employee</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Send Invite</button>
          </div>
        </form>
      </div>
    </div>
  );
}
