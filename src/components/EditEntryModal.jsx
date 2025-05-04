
// src/components/EditEntryModal.jsx
import React, { useState, useEffect } from 'react';
import { updateEntry } from '../services/api';
import { X } from 'lucide-react';
import './EditEntryModal.css';

const defaultForm = {
  fullName: '',
  email: '',
  platform: '',
  externalId: '',
  companyName: '',
  iban: '',
  bankName: '',
  beneficiary: '',
  extraData: {},
  salaryHistories: [],
  salary: ''
};

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated }) {
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState(null);

  // Populate form when entry changes
  useEffect(() => {
    if (entry) {
      const histories = Array.isArray(entry.salaryHistories) ? entry.salaryHistories : [];
      const latest = histories.slice().sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
      )[0];

      setFormData({
        fullName: entry.fullName || '',
        email: entry.email || '',
        platform: entry.platform || '',
        externalId: entry.externalId || '',
        companyName: entry.companyName || '',
        iban: entry.iban || '',
        bankName: entry.bankName || '',
        beneficiary: entry.beneficiary || '',
        extraData: typeof entry.extraData === 'object' && entry.extraData ? entry.extraData : {},
        salaryHistories: histories,
        salary: latest ? latest.amount : ''
      });
      setError(null);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const extraData = typeof formData.extraData === 'object' && formData.extraData
    ? formData.extraData
    : {};
  const salaryHistories = Array.isArray(formData.salaryHistories)
    ? formData.salaryHistories
    : [];
  const { salary } = formData;

  const latestHistory = salaryHistories.length
    ? salaryHistories.slice().sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
      )[0]
    : {};

  const handleChange = (key, value, nested = false) => {
    if (nested) {
      setFormData(f => ({
        ...f,
        extraData: { ...f.extraData, [key]: value }
      }));
    } else {
      setFormData(f => ({ ...f, [key]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    let updatedHistories = salaryHistories;
    if (salary !== '' && Number(salary) !== latestHistory.amount) {
      updatedHistories = [
        ...salaryHistories,
        { amount: Number(salary), changedAt: new Date().toISOString() }
      ];
    }

    try {
      await updateEntry(entry.id, {
        ...formData,
        salaryHistories: updatedHistories
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="edit-entry-modal">
      <aside className="modal-drawer">
        <div className="modal-header">
          <h2 className="modal-title">Edit Entry</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Basic fields */}
            {[
              { label: 'Full Name', key: 'fullName', type: 'text', required: true },
              { label: 'Email', key: 'email', type: 'email', required: true },
              { label: 'Company Name', key: 'companyName', type: 'text' },
              { label: 'External ID', key: 'externalId', type: 'text' },
              { label: 'IBAN', key: 'iban', type: 'text' },
              { label: 'Bank Name', key: 'bankName', type: 'text' },
              { label: 'Beneficiary', key: 'beneficiary', type: 'text' }
            ].map(field => (
              <div key={field.key} className="form-group">
                <label>{field.label}</label>
                <input
                  type={field.type}
                  required={field.required}
                  value={formData[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              </div>
            ))}

            {/* Platform selector */}
            <div className="form-group">
              <label>Platform</label>
              <select
                required
                value={formData.platform}
                onChange={e => handleChange('platform', e.target.value)}
              >
                <option value="">Select platform</option>
                <option value="GLOVO">GLOVO</option>
                <option value="TAZZ">TAZZ</option>
                <option value="BRINGO">BRINGO</option>
                <option value="ANGAJAT">ANGAJAT</option>
              </select>
            </div>

            {/* Salary */}
            <div className="form-group">
              <label>Salary (€)</label>
              <input
                type="number"
                step="0.01"
                value={salary}
                onChange={e => handleChange('salary', e.target.value)}
              />
            </div>

            {/* Latest change */}
            <div className="form-group">
              <label>Latest Change</label>
              <p>
                €{(latestHistory.amount ?? 0).toFixed(2)} on{' '}
                {latestHistory.changedAt
                  ? new Date(latestHistory.changedAt).toLocaleDateString()
                  : '-'}
              </p>
            </div>
          </div>

          {/* Glovo extraData */}
          {formData.platform === 'GLOVO' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Glovo Details</h3>
              <div className="form-grid">
                {Object.entries(extraData).map(([key, value]) => (
                  <div key={key} className="form-group">
                    <label>{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={e => handleChange(key, e.target.value, true)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-cancel">
              Cancel
            </button>
            <button type="submit" className="button-save">
              Save Changes
            </button>
          </div>
        </form>
      </aside>

      <div className="overlay" onClick={onClose} />
    </div>
);
```
