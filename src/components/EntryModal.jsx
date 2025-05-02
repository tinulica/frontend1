// src/components/EntryModal.jsx
import React, { useState, useEffect } from 'react';
import { addEntry, updateEntry } from '../services/api';

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

export default function EntryModal({ entry = null, onClose, onSaved }) {
  const isEdit = Boolean(entry && entry.id);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState('');
  const [externalId, setExternalId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [iban, setIban] = useState('');
  const [bankName, setBankName] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [error, setError] = useState(null);

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
    }
  }, [entry]);

  if (!entry) return null;

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
          {[
            { id: 'fullName', label: 'Full Name', type: 'text', value: fullName, setter: setFullName },
            { id: 'email', label: 'Email', type: 'email', value: email, setter: setEmail },
            { id: 'externalId', label: 'External ID', type: 'text', value: externalId, setter: setExternalId },
            { id: 'companyName', label: 'Company Name', type: 'text', value: companyName, setter: setCompanyName },
            { id: 'iban', label: 'IBAN', type: 'text', value: iban, setter: setIban },
            { id: 'bankName', label: 'Bank Name', type: 'text', value: bankName, setter: setBankName },
            { id: 'beneficiary', label: 'Beneficiary', type: 'text', value: beneficiary, setter: setBeneficiary }
          ].map(({ id, label, type, value, setter }) => (
            <div key={id} style={formGroupStyle}>
              <label htmlFor={id} style={labelStyle}>{label}</label>
              <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={e => setter(e.target.value)}
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


// src/components/Entries.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getEntries,
  deleteEntry,
  importEntries as apiImportEntries,
  exportEntries as apiExportEntries,
  emailSalaryById
} from '../services/api';
import EntryModal from './EntryModal';
import './Entries.css';

export default function Entries() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalEntry, setModalEntry] = useState(null);
  const fileInput = useRef();
  const pageSize = 10;

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      entries.filter(e =>
        e.fullName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        (e.externalId || '').toLowerCase().includes(term)
      )
    );
    setCurrentPage(1);
  }, [searchTerm, entries]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const { data } = await getEntries();
      setEntries(data);
      setFiltered(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await deleteEntry(id);
      setEntries(entries.filter(e => e.id !== id));
    } catch {
      alert('Failed to delete entry');
    }
  };

  const handleImportClick = () => fileInput.current.click();
  const onFileChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', 'default');
    try {
      await apiImportEntries(formData);
      fetchEntries();
    } catch {
      alert('Import failed');
    }
  };

  const handleExport = async () => {
    try {
      const resp = await apiExportEntries();
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url; link.setAttribute('download', 'entries.xlsx');
      document.body.appendChild(link); link.click(); link.remove();
    } catch {
      alert('Export failed');
    }
  };

  const handleEdit = (entry) => setModalEntry(entry);
  const handleHistory = (id) => navigate(`/entries/${id}/history`);
  const handleEmail = async (id) => { try { await emailSalaryById(id); alert('Email sent'); } catch { alert('Failed'); }};

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const currentData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <p>Loading entries...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="entries-container">
      <h1>Entries</h1>
      <div className="entries-controls">
        <input
          type="text"
          placeholder="Search by name, email, or ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="buttons">
          <button onClick={() => setModalEntry({})}>Add Entry</button>
          <button onClick={handleImportClick}>Import</button>
          <button onClick={handleExport}>Export</button>
        </div>
        <input type="file" ref={fileInput} onChange={onFileChange} style={{ display: 'none' }} accept=".xlsx" />
      </div>
      <EntryModal
        entry={modalEntry}
        onClose={() => setModalEntry(null)}
        onSaved={fetchEntries}
      />
      <table className="entries-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Platform</th><th>Ext ID</th><th>Salary</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {currentData.map(entry => {
            const latest = entry.salaryHistories
              .slice().sort((a,b)=>new Date(b.changedAt)-new Date(a.changedAt))[0];
            return (
              <tr key={entry.id}>
                <td>{entry.fullName}</td>
                <td>{entry.email}</td>
                <td>{entry.platform}</td>
                <td>{entry.externalId}</td>
                <td>€{latest?»'+latest.amount.toFixed(2):'—'}</td>
                <td className="actions">
                  <button onClick={()=>handleEdit(entry)}>Edit</button>
                  <button onClick={()=>handleDelete(entry.id)}>Delete</button>
                  <button onClick={()=>handleHistory(entry.id)}>History</button>
                  <button onClick={()=>handleEmail(entry.id)}>Email</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages}>Next</button>
      </div>
    </main>
  );
}
