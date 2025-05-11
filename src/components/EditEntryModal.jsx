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
      collabDetails: entry.collabDetails || {},
      isDetached: entry.isDetached || false,
      detachedToOrgId: entry.detachedToOrgId || ''
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
        </nav>

        <form className="eem-body" onSubmit={handleSubmit}>
          {activeTab === 'general' && (
            <>
              <div className="eem-section">
                <label>Full Name<input value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} /></label>
                <label>Email<input value={formData.email} onChange={e => handleChange('email', e.target.value)} /></label>
                <label>Platform<input value={formData.platform} onChange={e => handleChange('platform', e.target.value)} /></label>
                <label>Platform ID<input value={formData.externalId} onChange={e => handleChange('externalId', e.target.value)} /></label>
                <label>Collaboration Type
                  <select value={formData.collabType} onChange={e => handleChange('collabType', e.target.value)}>
                    <option value="">Select</option>
                    <option value="angajare">Angajare directa</option>
                    <option value="colaborare">Colaborare directa SRL/PFA</option>
                    <option value="detasare">Detasare alt SRL</option>
                  </select>
                </label>
              </div>

              {isAngajare && (
                <div className="eem-angajare">
                  <h4>Date personale</h4>
                  <label>CNP<input value={formData.collabDetails.cnp || ''} onChange={e => handleDetailChange('cnp', e.target.value)} /></label>
                  <label>Domiciliu<input value={formData.collabDetails.address || ''} onChange={e => handleDetailChange('address', e.target.value)} /></label>
                  <label>Serie CI<input value={formData.collabDetails.serie || ''} onChange={e => handleDetailChange('serie', e.target.value)} /></label>
                  <label>Numar CI<input value={formData.collabDetails.numar || ''} onChange={e => handleDetailChange('numar', e.target.value)} /></label>
                  <label>Emitent<input value={formData.collabDetails.emitent || ''} onChange={e => handleDetailChange('emitent', e.target.value)} /></label>
                  <label>Data Emitere<input type="date" value={formData.collabDetails.dataEmitere || ''} onChange={e => handleDetailChange('dataEmitere', e.target.value)} /></label>
                  <label>Data Expirare<input type="date" value={formData.collabDetails.dataExpirare || ''} onChange={e => handleDetailChange('dataExpirare', e.target.value)} /></label>
                  <h4>Date contractuale</h4>
                  <label>Nr. Contract<input value={formData.collabDetails.nrContract || ''} onChange={e => handleDetailChange('nrContract', e.target.value)} /></label>
                  <label>Data Emitere<input type="date" value={formData.collabDetails.dataContract || ''} onChange={e => handleDetailChange('dataContract', e.target.value)} /></label>
                  <label>Data Incepere<input type="date" value={formData.collabDetails.dataIncepere || ''} onChange={e => handleDetailChange('dataIncepere', e.target.value)} /></label>
                  <label>Norma<input value={formData.collabDetails.norma || ''} onChange={e => handleDetailChange('norma', e.target.value)} /></label>
                  <label>Detalii Norma<input value={formData.collabDetails.detaliiNorma || ''} onChange={e => handleDetailChange('detaliiNorma', e.target.value)} /></label>
                  <label>Comision<input value={formData.collabDetails.comision || ''} onChange={e => handleDetailChange('comision', e.target.value)} /></label>
                  <label>Data Incetare<input type="date" value={formData.collabDetails.dataIncetare || ''} onChange={e => handleDetailChange('dataIncetare', e.target.value)} /></label>
                </div>
              )}

              {isColaborare && (
                <div className="eem-colaborare">
                  <h4>Date Administrator</h4>
                  <label>CNP<input value={formData.collabDetails.cnp || ''} onChange={e => handleDetailChange('cnp', e.target.value)} /></label>
                  <label>Domiciliu<input value={formData.collabDetails.address || ''} onChange={e => handleDetailChange('address', e.target.value)} /></label>
                  <label>Serie CI<input value={formData.collabDetails.serie || ''} onChange={e => handleDetailChange('serie', e.target.value)} /></label>
                  <label>Numar CI<input value={formData.collabDetails.numar || ''} onChange={e => handleDetailChange('numar', e.target.value)} /></label>
                  <label>Emitent<input value={formData.collabDetails.emitent || ''} onChange={e => handleDetailChange('emitent', e.target.value)} /></label>
                  <label>Data Emitere<input type="date" value={formData.collabDetails.dataEmitere || ''} onChange={e => handleDetailChange('dataEmitere', e.target.value)} /></label>
                  <label>Data Expirare<input type="date" value={formData.collabDetails.dataExpirare || ''} onChange={e => handleDetailChange('dataExpirare', e.target.value)} /></label>
                  <h4>Date Colaborare</h4>
                  <label>Nume<input value={formData.collabDetails.nume || ''} onChange={e => handleDetailChange('nume', e.target.value)} /></label>
                  <label>TVA<select value={formData.collabDetails.tva || ''} onChange={e => handleDetailChange('tva', e.target.value)}><option value="">Select</option><option value="platitor">Platitor</option><option value="neplatitor">Neplatitor</option></select></label>
                  <label>CUI<input value={formData.collabDetails.cui || ''} onChange={e => handleDetailChange('cui', e.target.value)} /></label>
                  <label>RC<input value={formData.collabDetails.rc || ''} onChange={e => handleDetailChange('rc', e.target.value)} /></label>
                  <label>Tara<input value={formData.collabDetails.tara || ''} onChange={e => handleDetailChange('tara', e.target.value)} /></label>
                  <label>Judet<input value={formData.collabDetails.judet || ''} onChange={e => handleDetailChange('judet', e.target.value)} /></label>
                  <label>Localitate<input value={formData.collabDetails.localitate || ''} onChange={e => handleDetailChange('localitate', e.target.value)} /></label>
                  <label>Adresa<input value={formData.collabDetails.adresa || ''} onChange={e => handleDetailChange('adresa', e.target.value)} /></label>
                  <label>IBAN<input value={formData.collabDetails.iban || ''} onChange={e => handleDetailChange('iban', e.target.value)} /></label>
                  <label>Comision<input value={formData.collabDetails.comision || ''} onChange={e => handleDetailChange('comision', e.target.value)} /></label>
                  <label>Data Incepere<input type="date" value={formData.collabDetails.dataIncepere || ''} onChange={e => handleDetailChange('dataIncepere', e.target.value)} /></label>
                </div>
              )}
            </>
          )}

          {activeTab === 'detach' && (
            <div className="eem-detach">
              <p>Select the account to detach this entry to:</p>
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
