// src/components/EditEntryModal.jsx
import React, { useState, useEffect } from 'react';
import { updateEntry } from '../services/api';

// Modal backdrop and container styles (same as EntryModal)
const backdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
  background: '#fff', padding: '2rem', borderRadius: '8px',
  width: '90%', maxWidth: '500px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};
const formGroupStyle = { marginBottom: '1rem', display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.5rem', color: '#333', fontWeight: '500' };
const inputStyle = { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' };
const buttonStyle = { padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' };
const submitStyle = { ...buttonStyle, background: '#4f46e5', color: '#fff' };
const cancelStyle = { ...buttonStyle, background: '#6b7280', color: '#fff' };
const errorStyle = { color: '#dc2626', margin: '0.5rem 0', textAlign: 'center' };

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated }) {
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [platform, setPlatform]       = useState('');
  const [externalId, setExternalId]   = useState('');
  const [companyName, setCompanyName] = useState('');
  const [iban, setIban]               = useState('');
  const [bankName, setBankName]       = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [error, setError]             = useState(null);

  // Populate form when entry changes
  useEffect(() => {
    if (entry) {
      setFullName(entry.fullName || '');
      setEmail(entry.email || '');
      setPlatform(entry.platform || '');
      setExternalId(entry.externalId || '');
      setCompanyName(entry.companyName || '');
      setIban(entry.iban || '');
      setBankName(entry.bankName || '');
      setBeneficiary(entry.beneficiary || '');
      setError(null);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateEntry(entry.id, {
        fullName, email, platform,
        externalId, companyName, iban, bankName, beneficiary
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>Edit Entry</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="fullName" style={labelStyle}>Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="platform" style={labelStyle}>Platform</label>
            <select
              id="platform"
              name="platform"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              required
              style={inputStyle}
            >
              <option value="">Select platform</option>
              <option value="GLOVO">GLOVO</option>
              <option value="TAZZ">TAZZ</option>
              <option value="BRINGO">BRINGO</option>
              <option value="ANGAJAT">ANGAJAT</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="externalId" style={labelStyle}>External ID</label>
            <input
              id="externalId"
              name="externalId"
              type="text"
              value={externalId}
              onChange={e => setExternalId(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="companyName" style={labelStyle}>Company Name</label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="iban" style={labelStyle}>IBAN</label>
            <input
              id="iban"
              name="iban"
              type="text"
              value={iban}
              onChange={e => setIban(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="bankName" style={labelStyle}>Bank Name</label>
            <input
              id="bankName"
              name="bankName"
              type="text"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="beneficiary" style={labelStyle}>Beneficiary</label>
            <input
              id="beneficiary"
              name="beneficiary"
              type="text"
              value={beneficiary}
              onChange={e => setBeneficiary(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelStyle}>Cancel</button>
            <button type="submit" style={submitStyle}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
