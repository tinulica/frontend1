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
  width: '90%', maxWidth: '600px',
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

// Styling for salary history list
const historyListStyle = {
  maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd',
  borderRadius: '4px', padding: '0.5rem', background: '#fafafa'
};
const historyItemStyle = { fontSize: '0.9rem', marginBottom: '0.25rem' };

// Extra fields configuration per platform
const extraFieldsConfig = {
  GLOVO: [
    { key: 'zoneId', label: 'Zone ID' },
    { key: 'courierLevel', label: 'Courier Level' }
  ],
  TAZZ: [
    { key: 'vehicleType', label: 'Vehicle Type' }
  ],
  BRINGO: [
    { key: 'loadCapacity', label: 'Load Capacity' }
  ],
  ANGAJAT: [
    { key: 'employeeId', label: 'Employee ID' }
  ]
};

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated }) {
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [platform, setPlatform]       = useState('');
  const [externalId, setExternalId]   = useState('');
  const [companyName, setCompanyName] = useState('');
  const [iban, setIban]               = useState('');
  const [bankName, setBankName]       = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [extraData, setExtraData]     = useState({});
  const [salary, setSalary]           = useState('');
  const [salaryHistories, setSalaryHistories] = useState([]);
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
      setExtraData(entry.extraData || {});
      const histories = entry.salaryHistories || [];
      setSalaryHistories(histories);
      const latest = [...histories]
        .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];
      setSalary(latest ? latest.amount.toString() : '');
      setError(null);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  // Handle extra field changes
  const handleExtraChange = (key, value) => {
    setExtraData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Build new salary history if changed
    let newHistories = salaryHistories;
    const prev = salaryHistories.length
      ? [...salaryHistories].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0]
      : null;
    if (salary && (!prev || Number(salary) !== prev.amount)) {
      newHistories = [
        ...salaryHistories,
        { amount: Number(salary), changedAt: new Date().toISOString() }
      ];
    }

    try {
      await updateEntry(entry.id, {
        fullName, email, platform,
        externalId, companyName, iban, bankName, beneficiary,
        extraData,
        salaryHistories: newHistories
      });
      onUpdated(); onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Get extra fields for current platform
  const fields = extraFieldsConfig[platform] || [];

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0, color: '#333' }}>Edit Entry</h2>
        <form onSubmit={handleSubmit}>

          {/* Standard fields */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={fullName}
              onChange={e => setFullName(e.target.value)} required />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Platform</label>
            <select style={inputStyle} value={platform}
              onChange={e => setPlatform(e.target.value)} required>
              <option value="">Select platform</option>
              {Object.keys(extraFieldsConfig).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Core optional fields */}
          {[
            { label: 'External ID', value: externalId, setter: setExternalId },
            { label: 'Company Name', value: companyName, setter: setCompanyName },
            { label: 'IBAN', value: iban, setter: setIban },
            { label: 'Bank Name', value: bankName, setter: setBankName },
            { label: 'Beneficiary', value: beneficiary, setter: setBeneficiary }
          ].map(f => (
            <div key={f.label} style={formGroupStyle}>
              <label style={labelStyle}>{f.label}</label>
              <input style={inputStyle} value={f.value}
                onChange={e => f.setter(e.target.value)} />
            </div>
          ))}

          {/* Platform-specific fields */}
          {fields.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#555' }}>Additional {platform} Data</h3>
              {fields.map(f => (
                <div key={f.key} style={formGroupStyle}>
                  <label style={labelStyle}>{f.label}</label>
                  <input style={inputStyle} value={extraData[f.key] || ''}
                    onChange={e => handleExtraChange(f.key, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* Salary input */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Salary (€)</label>
            <input style={inputStyle} type="number" step="0.01"
              value={salary} onChange={e => setSalary(e.target.value)} />
          </div>

          {/* Salary history list */}
          {salaryHistories.length > 0 && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Salary History</label>
              <div style={historyListStyle}>
                {[...salaryHistories]
                  .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                  .map((h, i) => (
                    <div key={i} style={historyItemStyle}>
                      €{h.amount.toFixed(2)} • {new Date(h.changedAt).toLocaleDateString()}
                    </div>
                ))}
              </div>
            </div>
          )}

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
