// src/components/InvitationModal.jsx
import React, { useState } from 'react';

export default function InvitationModal({ isOpen, onClose, onSent }) {
  const [email, setEmail]   = useState('');
  const [error, setError]   = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await onSent(email);
      setEmail('');      // clear out the input
      onClose();         // only close if it succeeded
    } catch (err) {
      // show the backend’s message if present (409, 400, etc)
      const msg = err.response?.data?.message || err.message;
      setError(msg);
    }
  };

  const handleCancel = () => {
    setError(null);
    setEmail('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Invite Employee</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="invite-email">Email</label>
          <input
            id="invite-email"
            type="email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="submit">Send Invite</button>
          </div>
        </form>
      </div>
    </div>
  );
}
