import React, { useState, useEffect } from 'react';
import { updateEntry }     from '../services/api';
import { X }               from 'lucide-react';
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
  const [formData, setFormData]     = useState(DEFAULT_FORM);
  const [error, setError]           = useState(null);
  const [activeTab, setActiveTab]   = useState('info');

  useEffect(() => {
    if (!entry) return;
    const histories = Array.isArray(entry.salaryHistories) ? entry.salaryHistories : [];
    const latest    = histories.slice().sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];
    setFormData({
      fullName:       entry.fullName      || '',
      email:          entry.email         || '',
      platform:       entry.platform      || '',
      externalId:     entry.externalId    || '',
      companyName:    entry.companyName   || '',
      iban:           entry.iban          || '',
      bankName:       entry.bankName      || '',
      beneficiary:    entry.beneficiary   || '',
      extraData:      entry.extraData     || {},
      salaryHistories: histories,
      salary:         latest ? latest.amount : ''
    });
    setError(null);
    setActiveTab('info');
  }, [entry]);

  if (!isOpen || !entry) return null;

  const {
    fullName, email,
    externalId, companyName,
    iban, bankName,
    beneficiary, extraData,
    salaryHistories, salary
  } = formData;

  const histories     = Array.isArray(salaryHistories) ? salaryHistories : [];
  const latestHistory = histories.length
    ? histories.slice().sort((a,b)=>new Date(b.changedAt)-new Date(a.changedAt))[0]
    : {};

  const handleChange = (key, value, nested = false) => {
    setFormData(f => nested
      ? { ...f, extraData: { ...f.extraData, [key]: value } }
      : { ...f, [key]: value }
    );
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError(null);
    let updated = histories;
    if (salary !== '' && Number(salary) !== latestHistory.amount) {
      updated = [...histories, { amount: Number(salary), changedAt: new Date().toISOString() }];
    }
    try {
      await updateEntry(entry.id, { ...formData, salaryHistories: updated });
      onUpdated(); onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Build tabs
  const tabs = [
    { key: 'info',      label: 'Info' },
    ...(formData.platform === 'GLOVO'
      ? [{ key: 'glovo', label: 'Glovo Details' }]
      : []),
    { key: 'bank',      label: 'Bank Details' },
    { key: 'documents', label: 'Documents' }
  ];

  const renderSection = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="settings-section">
            <label>Full Name<input type="text" value={fullName} onChange={e=>handleChange('fullName', e.target.value)} /></label>
            <label>Email    <input type="email" value={email} onChange={e=>handleChange('email', e.target.value)} /></label>
            <label>External ID<input type="text" value={externalId} onChange={e=>handleChange('externalId', e.target.value)} /></label>
          </div>
        );
      case 'glovo':
        return (
          <div className="settings-section">
            {Object.entries(extraData).map(([k,v])=>(
              <label key={k}>{k}<input value={v} onChange={e=>handleChange(k, e.target.value, true)} /></label>
            ))}
          </div>
        );
      case 'bank':
        return (
          <div className="settings-section">
            <label>Company Name<input type="text" value={companyName} onChange={e=>handleChange('companyName', e.target.value)} /></label>
            <label>IBAN        <input type="text" value={iban}        onChange={e=>handleChange('iban', e.target.value)} /></label>
            <label>Bank Name   <input type="text" value={bankName}    onChange={e=>handleChange('bankName', e.target.value)} /></label>
            <label>Beneficiary <input type="text" value={beneficiary} onChange={e=>handleChange('beneficiary', e.target.value)} /></label>
          </div>
        );
      case 'documents':
        return <div className="settings-section">No documents uploaded.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <aside className="settings-modal" onClick={e=>e.stopPropagation()}>
        <header className="settings-header">
          <h2>Edit Entry</h2>
          <button onClick={onClose}><X size={20} /></button>
        </header>

        <div className="settings-body">
          <nav className="settings-sidebar">
            {tabs.map(t=>(
              <button
                key={t.key}
                className={`settings-nav-item ${activeTab===t.key?'active':''}`}
                onClick={()=>setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <form className="settings-content" onSubmit={handleSubmit}>
            {renderSection()}
            {error && <p className="settings-error">{error}</p>}
            <div className="settings-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
}
