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
  collabType: '',
  collabDetails: {},
  salary: ''
};

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!entry) return;
    const latest = Array.isArray(entry.salaryHistories)
      ? [...entry.salaryHistories].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0]
      : null;
    setFormData({
      fullName: entry.fullName || '',
      email: entry.email || '',
      platform: entry.platform || '',
      externalId: entry.externalId || '',
      collabType: entry.collabType || '',
      collabDetails: entry.collabDetails || {},
      salary: latest?.amount || ''
    });
    setError(null);
    setActiveTab('info');
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleChange = (key, value, nested = false) => {
    setFormData(f => nested
      ? { ...f, collabDetails: { ...f.collabDetails, [key]: value } }
      : { ...f, [key]: value }
    );
  };

  const handleSubmit = async e => {
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

  const renderCollabFields = () => {
    if (formData.collabType === 'angajare') {
      return (
        <>
          <h4>Date Personale</h4>
          <label>CNP<input value={formData.collabDetails.cnp || ''} onChange={e => handleChange('cnp', e.target.value, true)} /></label>
          <label>Adresa<input value={formData.collabDetails.adresa || ''} onChange={e => handleChange('adresa', e.target.value, true)} /></label>
          <label>Serie CI<input value={formData.collabDetails.serieCI || ''} onChange={e => handleChange('serieCI', e.target.value, true)} /></label>
          <label>Numar CI<input value={formData.collabDetails.numarCI || ''} onChange={e => handleChange('numarCI', e.target.value, true)} /></label>
          <label>Emitent<input value={formData.collabDetails.emitent || ''} onChange={e => handleChange('emitent', e.target.value, true)} /></label>
          <label>Data Emitere<input type="date" value={formData.collabDetails.dataEmitere || ''} onChange={e => handleChange('dataEmitere', e.target.value, true)} /></label>
          <label>Data Expirare<input type="date" value={formData.collabDetails.dataExpirare || ''} onChange={e => handleChange('dataExpirare', e.target.value, true)} /></label>

          <h4>Date Contractuale</h4>
          <label>Nr Contract<input value={formData.collabDetails.nrContract || ''} onChange={e => handleChange('nrContract', e.target.value, true)} /></label>
          <label>Data Emitere<input type="date" value={formData.collabDetails.dataEmitere || ''} onChange={e => handleChange('dataEmitere', e.target.value, true)} /></label>
          <label>Data Incepere<input type="date" value={formData.collabDetails.dataIncepere || ''} onChange={e => handleChange('dataIncepere', e.target.value, true)} /></label>
          <label>Norma de Lucru<input value={formData.collabDetails.normaLucru || ''} onChange={e => handleChange('normaLucru', e.target.value, true)} /></label>
          <label>Comision<input value={formData.collabDetails.comision || ''} onChange={e => handleChange('comision', e.target.value, true)} /></label>
          <label>Data Incetare<input type="date" value={formData.collabDetails.dataIncetare || ''} onChange={e => handleChange('dataIncetare', e.target.value, true)} /></label>
        </>
      );
    } else if (formData.collabType === 'colaborare') {
      return (
        <>
          <h4>Date Administrator</h4>
          <label>CNP<input value={formData.collabDetails.cnp || ''} onChange={e => handleChange('cnp', e.target.value, true)} /></label>
          <label>Adresa<input value={formData.collabDetails.adresa || ''} onChange={e => handleChange('adresa', e.target.value, true)} /></label>
          <label>Serie CI<input value={formData.collabDetails.serieCI || ''} onChange={e => handleChange('serieCI', e.target.value, true)} /></label>
          <label>Numar CI<input value={formData.collabDetails.numarCI || ''} onChange={e => handleChange('numarCI', e.target.value, true)} /></label>
          <label>Emitent<input value={formData.collabDetails.emitent || ''} onChange={e => handleChange('emitent', e.target.value, true)} /></label>
          <label>Data Emitere<input type="date" value={formData.collabDetails.dataEmitere || ''} onChange={e => handleChange('dataEmitere', e.target.value, true)} /></label>
          <label>Data Expirare<input type="date" value={formData.collabDetails.dataExpirare || ''} onChange={e => handleChange('dataExpirare', e.target.value, true)} /></label>

          <h4>Date Colaborare</h4>
          <label>Nume<input value={formData.collabDetails.numeFirm || ''} onChange={e => handleChange('numeFirm', e.target.value, true)} /></label>
          <label>Platitor TVA<select value={formData.collabDetails.tva || ''} onChange={e => handleChange('tva', e.target.value, true)}><option value="">--</option><option value="da">Da</option><option value="nu">Nu</option></select></label>
          <label>CUI<input value={formData.collabDetails.cui || ''} onChange={e => handleChange('cui', e.target.value, true)} /></label>
          <label>Registrul Comertului<input value={formData.collabDetails.registru || ''} onChange={e => handleChange('registru', e.target.value, true)} /></label>
          <label>Tara<input value={formData.collabDetails.tara || ''} onChange={e => handleChange('tara', e.target.value, true)} /></label>
          <label>Judet<input value={formData.collabDetails.judet || ''} onChange={e => handleChange('judet', e.target.value, true)} /></label>
          <label>Localitate<input value={formData.collabDetails.localitate || ''} onChange={e => handleChange('localitate', e.target.value, true)} /></label>
          <label>Adresa<input value={formData.collabDetails.adresaFirma || ''} onChange={e => handleChange('adresaFirma', e.target.value, true)} /></label>
          <label>IBAN<input value={formData.collabDetails.ibanFirma || ''} onChange={e => handleChange('ibanFirma', e.target.value, true)} /></label>
          <label>Comision<input value={formData.collabDetails.comision || ''} onChange={e => handleChange('comision', e.target.value, true)} /></label>
          <label>Data Incepere<input type="date" value={formData.collabDetails.dataIncepere || ''} onChange={e => handleChange('dataIncepere', e.target.value, true)} /></label>
        </>
      );
    }
    return null;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <aside className="settings-modal" onClick={e => e.stopPropagation()}>
        <header className="settings-header">
          <h2>Edit Entry</h2>
          <button onClick={onClose}><X size={20} /></button>
        </header>

        <form className="settings-content" onSubmit={handleSubmit}>
          <label>Full Name<input value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} /></label>
          <label>Email<input value={formData.email} onChange={e => handleChange('email', e.target.value)} /></label>
          <label>Platform<input value={formData.platform} onChange={e => handleChange('platform', e.target.value)} /></label>
          <label>External ID<input value={formData.externalId} onChange={e => handleChange('externalId', e.target.value)} /></label>

          <label>Forma de colaborare
            <select value={formData.collabType} onChange={e => handleChange('collabType', e.target.value)}>
              <option value="">Selectează...</option>
              <option value="angajare">Angajare directa</option>
              <option value="colaborare">Colaborare SRL / PFA</option>
            </select>
          </label>

          {renderCollabFields()}

          <label>Ultimul salariu
            <input
              type="number"
              value={formData.salary}
              onChange={e => handleChange('salary', e.target.value)}
            />
          </label>

          {error && <p className="settings-error">{error}</p>}

          <div className="settings-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </aside>
    </div>
  );
}
