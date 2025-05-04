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

  useEffect(() => {
    if (!entry) return;
    const histories = Array.isArray(entry.salaryHistories) ? entry.salaryHistories : [];
    const latest = histories.slice().sort(
      (a, b) => new Date(b.changedAt) - new Date(a.changedAt))
      [0] || {};
    setFormData({
      fullName: entry.fullName || '',
      email: entry.email || '',
      platform: entry.platform || '',
      externalId: entry.externalId || '',
      companyName: entry.companyName || '',
      iban: entry.iban || '',
      bankName: entry.bankName || '',
      beneficiary: entry.beneficiary || '',
      extraData: typeof entry.extraData === 'object' ? entry.extraData : {},
      salaryHistories: histories,
      salary: latest.amount ?? ''
    });
    setError(null);
  }, [entry]);

  if (!isOpen || !entry) return null;

  const { extraData, salaryHistories, salary } = formData;
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
    <div className="modal-overlay">
      <aside className="modal-drawer">
        <header className="modal-header">
          <h2 className="modal-title">Edit Entry</h2>
          <button onClick={onClose} className="close-button">
            <X className="h-6 w-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {[
              { label: 'Full Name', key: 'fullName', type: 'text', required: true },
              { label: 'Email', key: 'email', type: 'email', required: true },
              { label: 'Company Name', key: 'companyName', type: 'text' },
              { label: 'External ID', key: 'externalId', type: 'text' },
              { label: 'IBAN', key: 'iban', type: 'text' },
              { label: 'Bank Name', key: 'bankName', type: 'text' },
              { label: 'Beneficiary', key: 'beneficiary', type: 'text' }
            ].map(f => (
              <div key={f.key} className="form-field">
                <label className="form-label">{f.label}</label>
                <input
                  type={f.type}
                  required={!!f.required}
                  value={formData[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  className="form-input"
                />
              </div>
            ))}

            <div className="form-field">
              <label className="form-label">Platform</label>
              <select
                required
                value={formData.platform}
                onChange={e => handleChange('platform', e.target.value)}
                className="form-select"
              >
                <option value="">Select platform</option>
                <option value="GLOVO">GLOVO</option>
                <option value="TAZZ">TAZZ</option>
                <option value="BRINGO">BRINGO</option>
                <option value="ANGAJAT">ANGAJAT</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Salary (€)</label>
              <input
                type="number"
                step="0.01"
                value={salary}
                onChange={e => handleChange('salary', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Latest Change</label>
              <p className="text-gray-600">
                €{(latestHistory.amount ?? 0).toFixed(2)} on{' '}
                {latestHistory.changedAt
                  ? new Date(latestHistory.changedAt).toLocaleDateString()
                  : '-'}
              </p>
            </div>
          </div>

          {formData.platform === 'GLOVO' && (
            <div>
              <h3 className="form-section-title">Glovo Details</h3>
              <div className="form-grid">
                {Object.entries(extraData).map(([key, val]) => (
                  <div key={key} className="form-field">
                    <label className="form-label">{key}</label>
                    <input
                      type="text"
                      value={val}
                      onChange={e => handleChange(key, e.target.value, true)}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <div className="button-group">
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </aside>

      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
