// src/components/EditEntryModal.jsx
import React, { useState, useEffect } from 'react';
import { updateEntry } from '../services/api';
import { X } from 'lucide-react';
import './EditEntryModal.css';

const DEFAULT_FORM = {
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
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (entry) {
      const histories = Array.isArray(entry.salaryHistories) ? entry.salaryHistories : [];
      const latest = histories.slice().sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];
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
      setActiveTab('info');
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const { fullName, email, platform, externalId, companyName, iban, bankName, beneficiary, extraData, salaryHistories, salary } = formData;
  const histories = Array.isArray(salaryHistories) ? salaryHistories : [];
  const latestHistory = histories.length
    ? histories.slice().sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0]
    : {};

  const handleChange = (key, value, nested = false) => {
    if (nested) {
      setFormData(f => ({ ...f, extraData: { ...f.extraData, [key]: value } }));
    } else {
      setFormData(f => ({ ...f, [key]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    let updatedHist = histories;
    if (salary !== '' && Number(salary) !== latestHistory.amount) {
      updatedHist = [...histories, { amount: Number(salary), changedAt: new Date().toISOString() }];
    }

    try {
      await updateEntry(entry.id, { ...formData, salaryHistories: updatedHist });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Build tabs: always Info, Bank, Documents
  const tabs = [
    { key: 'info', label: 'Info' },
    { key: 'bank', label: 'Bank Details' },
    { key: 'documents', label: 'Documents' }
  ];
  if (platform === 'GLOVO') {
    tabs.splice(1, 0, { key: 'glovo', label: 'Glovo Details' });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="section">
            <h3 className="section-title">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: fullName, key: 'fullName', type: 'text' },
                { label: 'Email', value: email, key: 'email', type: 'email' },
                { label: 'External ID', value: externalId, key: 'externalId', type: 'text' }
              ].map(f => (
                <div key={f.key} className="field">
                  <label className="field-label">{f.label}</label>
                  <input
                    className="field-input"
                    type={f.type}
                    value={f.value}
                    onChange={e => handleChange(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'glovo':
        return (
          <div className="section">
            <h3 className="section-title">Glovo Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(extraData).map(([key, val]) => (
                <div key={key} className="field">
                  <label className="field-label">{key}</label>
                  <input
                    className="field-input"
                    type="text"
                    value={val}
                    onChange={e => handleChange(key, e.target.value, true)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'bank':
        return (
          <div className="section">
            <h3 className="section-title">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Company', value: companyName, key: 'companyName' },
                { label: 'IBAN', value: iban, key: 'iban' },
                { label: 'Bank Name', value: bankName, key: 'bankName' },
                { label: 'Beneficiary', value: beneficiary, key: 'beneficiary' }
              ].map(f => (
                <div key={f.key} className="field">
                  <label className="field-label">{f.label}</label>
                  <input
                    className="field-input"
                    type="text"
                    value={f.value}
                    onChange={e => handleChange(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="section">
            <h3 className="section-title">Documents</h3>
            <p>No documents uploaded.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <aside className="modal-drawer">
        <div className="modal-header">
          <h2 className="text-xl font-semibold">Edit Entry</h2>
          <button onClick={onClose}><X className="h-6 w-6 text-gray-600" /></button>
        </div>
        <div className="flex h-full">
          <nav className="tab-nav">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`tab-button ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <form onSubmit={handleSubmit} className="tab-content">
            {renderContent()}
            {error && <p className="error-text">{error}</p>}
            <div className="actions">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </aside>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
