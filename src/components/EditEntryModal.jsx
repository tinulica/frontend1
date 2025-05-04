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
const historyListStyle = { maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '0.5rem' };
const historyItemStyle = { fontSize: '0.9rem', marginBottom: '0.25rem' };

// Define extra fields per platform
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

  const handleExtraChange = (key, value) => {
    setExtraData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Append salary history if changed
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

      await updateEntry(entry.id, {
        fullName, email, platform,
        externalId, companyName, iban, bankName, beneficiary,
        extraData,
        salaryHistories: newHistories
      });

      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const fields = extraFieldsConfig[platform] || [];

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>Edit Entry</h2>
        <form onSubmit={handleSubmit}>
          {/* Standard fields */}
          {[
            { id: 'fullName', label: 'Full Name', type: 'text', value: fullName, setter: setFullName, required: true },
            { id: 'email', label: 'Email', type: 'email', value: email, setter: setEmail, required: true },
            { id: 'platform', label: 'Platform', type: 'select', value: platform, setter: setPlatform, options: ['GLOVO','TAZZ','BRINGO','ANGAJAT'], required: true },
            { id: 'externalId', label: 'External ID', type: 'text', value: externalId, setter: setExternalId },
            { id: 'companyName', label: 'Company Name', type: 'text', value: companyName, setter: setCompanyName },
            { id: 'iban', label: 'IBAN', type: 'text', value: iban, setter: setIban },
            { id: 'bankName', label: 'Bank Name', type: 'text', value: bankName, setter: setBankName },
            { id: 'beneficiary', label: 'Beneficiary', type: 'text', value: beneficiary, setter: setBeneficiary }
          ].map(field => (
            <div key={field.id} style={formGroupStyle}>
              <label htmlFor={field.id} style={labelStyle}>{field.label}</label>
              {field.type === 'select' ? (
                <select
                  id={field.id} name={field.id} value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  required={field.required}
                  style={inputStyle}
                >
                  <option value="">Select platform</option>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  id={field.id} name={field.id} type={field.type} value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  required={field.required}
                  style={inputStyle}
                />
              )}
            </div>
          ))}

          {/* Platform-specific extra fields */}
          {fields.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', color: '#555' }}>Additional {platform} Data</h3>
              {fields.map(f => (
                <div key={f.key} style={formGroupStyle}>
                  <label htmlFor={f.key} style={labelStyle}>{f.label}</label>
                  <input
                    id={f.key} name={f.key} type="text"
                    value={extraData[f.key] || ''}
                    onChange={e => handleExtraChange(f.key, e.target.value)}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Salary and history */}
          <div style={formGroupStyle}>
            <label htmlFor="salary" style={labelStyle}>Salary (€)</label>
            <input
              id="salary" name="salary" type="number" step="0.01"
              value={salary} onChange={e => setSalary(e.target.value)}
              style={inputStyle}
            />
          </div>
          {salaryHistories.length > 0 && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Salary History</label>
              <div style={historyListStyle}>
                {[...salaryHistories]
                  .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
                  .map((h, idx) => (
                    <div key={idx} style={historyItemStyle}>
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
