// src/components/EntryModal.jsx
import React, { useState } from 'react';
import { addEntry } from '../services/api';
import './EntryModal.css';

export default function EntryModal({ isOpen, onClose, onAdded }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await addEntry({ fullName, email, platform });
      onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Add Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="platform">Platform</label>
            <select
              id="platform"
              name="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
            >
              <option value="">Select platform</option>
              <option value="GLOVO">GLOVO</option>
              <option value="TAZZ">TAZZ</option>
              <option value="BRINGO">BRINGO</option>
              <option value="ANGAJAT">ANGAJAT</option>
            </select>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
