// src/components/EntryModal.jsx
import React, { useState } from 'react';
import { addEntry, updateEntry } from '../services/api';

// Inline styles for modal UI
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
const labelStyle = { marginBottom: '0.5rem', color: '#333', fontWeight: '500' };
const inputStyle = { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
const selectStyle = inputStyle;
const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' };
const buttonStyle = { padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' };
const submitStyle = { ...buttonStyle, background: '#4f46e5', color: '#fff' };
const cancelStyle = { ...buttonStyle, background: '#6b7280', color: '#fff' };
const errorStyle = { color: '#dc2626', margin: '0.5rem 0', textAlign: 'center' };

export default function EntryModal({ entry = {}, onClose, onSaved }) {
  const isEdit = Boolean(entry.id);
  const [fullName, setFullName] = useState(entry.fullName || '');
  const [email, setEmail] = useState(entry.email || '');
  const [platform, setPlatform] = useState(entry.platform || '');
  const [externalId, setExternalId] = useState(entry.externalId || '');
  const [companyName, setCompanyName] = useState(entry.companyName || '');
  const [iban, setIban] = useState(entry.iban || '');
  const [bankName, setBankName] = useState(entry.bankName || '');
  const [beneficiary, setBeneficiary] = useState(entry.beneficiary || '');
  const [error, setError] = useState(null);

  // Prevent rendering when closed
  if (!entry && !isEdit) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = { fullName, email, platform, externalId, companyName, iban, bankName, beneficiary };
    try {
      if (isEdit) {
        await updateEntry(entry.id, payload);
      } else {
        await addEntry(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>
          {isEdit ? 'Edit Entry' : 'Add Entry'}
        </h2>
        <form onSubmit={handleSubmit}>
          {[{
            id: 'fullName', label: 'Full Name', type: 'text', value: fullName, setter: setFullName
          }, {
            id: 'email', label: 'Email', type: 'email', value: email, setter: setEmail
          }, {
            id: 'externalId', label: 'External ID', type: 'text', value: externalId, setter: setExternalId
          }, {
            id: 'companyName', label: 'Company Name', type: 'text', value: companyName, setter: setCompanyName
          }, {
            id: 'iban', label: 'IBAN', type: 'text', value: iban, setter: setIban
          }, {
            id: 'bankName', label: 'Bank Name', type: 'text', value: bankName, setter: setBankName
          }, {
            id: 'beneficiary', label: 'Beneficiary', type: 'text', value: beneficiary, setter: setBeneficiary
          }].map(field => (
            <div key={field.id} style={formGroupStyle}>
              <label htmlFor={field.id} style={labelStyle}>{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}

          <div style={formGroupStyle}>
            <label htmlFor="platform" style={labelStyle}>Platform</label>
            <select
              id="platform"
              name="platform"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              required
              style={selectStyle}
            >
              <option value="">Select platform</option>
              <option value="GLOVO">GLOVO</option>
              <option value="TAZZ">TAZZ</option>
              <option value="BRINGO">BRINGO</option>
              <option value="ANGAJAT">ANGAJAT</option>
            </select>
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelStyle}>Cancel</button>
            <button type="submit" style={submitStyle}>{isEdit ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
