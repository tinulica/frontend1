import React, { useState, useEffect } from 'react';
import { updateEntry } from '../services/api';
import { X } from 'lucide-react';
import './EditEntryModal.css';

const DEFAULT_FORM = {
  fullName: '',
  email: '',
  platform: '',
  externalId: '',
  collabType: '',
  collabDetails: {},
  salary: '',
  detachedToOrgId: '',
  isDetached: false
};

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated, orgList = [] }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!entry) return;
    const latestSalary = (entry.salaryHistories || []).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    setFormData({
      ...DEFAULT_FORM,
      ...entry,
      salary: latestSalary ? latestSalary.amount : '',
      collabDetails: entry.collabDetails || {}
    });
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleDetailChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      collabDetails: {
        ...prev.collabDetails,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateEntry(entry.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const isAngajare = formData.collabType === 'angajare';
  const isColaborare = formData.collabType === 'colaborare';
  const isDetasare = formData.collabType === 'detasare';

  return (
    <div className="eem-backdrop" onClick={onClose}>
      <aside className="eem-modal" onClick={e => e.stopPropagation()}>
        <header className="eem-header">
          <h2>Edit Entry</h2>
          <button onClick={onClose}><X size={20} /></button>
        </header>

        <nav className="eem-tabs">
          <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>General</button>
          <button className={activeTab === 'detach' ? 'active' : ''} onClick={() => setActiveTab('detach')}>Detach</button>
          <button className={activeTab === 'documents' ? 'active' : ''} onClick={() => setActiveTab('documents')}>Documents</button>
          <button className={activeTab === 'salary' ? 'active' : ''} onClick={() => setActiveTab('salary')}>Salary</button>
        </nav>

        <form className="eem-body" onSubmit={handleSubmit}>
          {activeTab === 'general' && (
            <div className="eem-section">
              <label>Full Name<input value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} /></label>
              <label>Email<input value={formData.email} onChange={e => handleChange('email', e.target.value)} /></label>
              <label>Platform<input value={formData.platform} onChange={e => handleChange('platform', e.target.value)} /></label>
              <label>Platform ID<input value={formData.externalId} onChange={e => handleChange('externalId', e.target.value)} /></label>
              <label>Collaboration Type
  <select
    value={formData.collabType}
    onChange={e => handleChange('collabType', e.target.value)}
  >
    <option value="">Select</option>
    <option value="angajare">Angajare directa</option>
    <option value="colaborare">Colaborare directa SRL/PFA</option>
    <option value="detasare">Detasare alt SRL</option>
  </select>
</label>
            </div>
          )}

          {activeTab === 'detach' && (
            <div className="eem-detach">
              <label>Destination Organization
                <select value={formData.detachedToOrgId} onChange={e => handleChange('detachedToOrgId', e.target.value)}>
                  <option value="">Select organization</option>
                  {orgList.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isDetached}
                  onChange={e => handleChange('isDetached', e.target.checked)}
                /> Mark as detached
              </label>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="eem-documents">
              <p>No documents uploaded yet.</p>
              {/* Future file upload logic here */}
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="eem-salary">
              <label>Latest Salary
                <input type="number" value={formData.salary} onChange={e => handleChange('salary', e.target.value)} />
              </label>
              <div className="salary-history">
                <h4>Salary History</h4>
                <ul>
                  {(entry.salaryHistories || []).sort((a, b) => new Date(b.date) - new Date(a.date)).map((s, i) => (
                    <li key={i}>
                      <strong>{new Date(s.date).toLocaleDateString()}:</strong> €{s.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {error && <p className="eem-error">{error}</p>}

          <footer className="eem-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </footer>
        </form>
      </aside>
    </div>
  );
}
