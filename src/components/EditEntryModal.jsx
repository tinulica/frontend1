// src/components/EditEntryModal.jsx
import React, { useState, useEffect } from 'react';
import { updateEntry } from '../services/api';

// Inline styles (reuse from EntryModal)
const backdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
  background: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};
const formGroupStyle = { marginBottom: '1rem', display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '0.5rem', color: '#333', fontWeight: '500' };
const inputStyle = { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
const selectStyle = inputStyle;
const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' };
const buttonStyle = { padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' };
const submitStyle = { ...buttonStyle, background: '#4f46e5', color: '#fff' };
const cancelStyle = { ...buttonStyle, background: '#6b7280', color: '#fff' };
const errorStyle = { color: '#dc2626', margin: '0.5rem 0', textAlign: 'center' };

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [externalId, setExternalId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [iban, setIban] = useState('');
  const [bankName, setBankName] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (entry) {
      setFullName(entry.fullName ?? '');
      setEmail(entry.email ?? '');
      setPlatform(entry.platform ?? '');
      setExternalId(entry.externalId ?? '');
      setCompanyName(entry.companyName ?? '');
      setIban(entry.iban ?? '');
      setBankName(entry.bankName ?? '');
      setBeneficiary(entry.beneficiary ?? '');
      setError(null);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = { fullName, email, platform, externalId, companyName, iban, bankName, beneficiary };
    try {
      await updateEntry(entry.id, payload);
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
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Platform</label>
            <select style={selectStyle} value={platform} onChange={e => setPlatform(e.target.value)} required>
              <option value="">Select platform</option>
              <option value="GLOVO">GLOVO</option>
              <option value="TAZZ">TAZZ</option>
              <option value="BRINGO">BRINGO</option>
              <option value="ANGAJAT">ANGAJAT</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>External ID</label>
            <input style={inputStyle} value={externalId} onChange={e => setExternalId(e.target.value)} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Company Name</label>
            <input style={inputStyle} value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>IBAN</label>
            <input style={inputStyle} value={iban} onChange={e => setIban(e.target.value)} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bank Name</label>
            <input style={inputStyle} value={bankName} onChange={e => setBankName(e.target.value)} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Beneficiary</label>
            <input style={inputStyle} value={beneficiary} onChange={e => setBeneficiary(e.target.value)} />
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
