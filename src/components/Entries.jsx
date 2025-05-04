// src/components/Entries.jsx

import React, { useEffect, useState, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import {
  getEntries,
  deleteEntry,
  importEntries as apiImportEntries,
  exportEntries as apiExportEntries,
  emailSalaryById
} from '../services/api';
import EntryModal from './EntryModal';
import EditEntryModal from './EditEntryModal';
import { Edit2, Trash2, Clock, Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Entries.css';

export default function Entries() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [editEntry, setEditEntry]   = useState(null);
  const fileInput = useRef();
  const pageSize  = 10;

  // Fetch entries
  async function fetchEntries() {
    setLoading(true);
    try {
      const { data } = await getEntries();
      setEntries(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchEntries();
  }, []);

  // Real‑time subscriptions
  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') }
    });

    // Join the org room
    socket.emit('joinOrg', user.organizationId);

    // Refresh on any change
    socket.on('entryAdded',    fetchEntries);
    socket.on('entryUpdated',  fetchEntries);
    socket.on('entryDeleted',  fetchEntries);

    return () => {
      socket.off('entryAdded',   fetchEntries);
      socket.off('entryUpdated', fetchEntries);
      socket.off('entryDeleted', fetchEntries);
      socket.disconnect();
    };
  }, [user]);

  // Filter whenever entries or searchTerm change
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      entries.filter(e =>
        e.fullName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        (e.externalId || '').toLowerCase().includes(term)
      )
    );
    setPage(1);
  }, [entries, searchTerm]);

  const handleImport = () => fileInput.current.click();
  const onFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('platform', 'GLOVO');
    try {
      await apiImportEntries(form);
      fetchEntries();
    } catch {
      alert('Import failed');
    }
  };

  const handleExport = async () => {
    try {
      const resp = await apiExportEntries();
      const url  = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'entries.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Export failed');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete entry?')) return;
    try {
      await deleteEntry(id);
      fetchEntries();
    } catch {
      alert('Delete failed');
    }
  };

  const handleAddClick    = () => setShowAdd(true);
  const handleEditClick   = entry => setEditEntry(entry);
  const handleHistory     = id => { /* e.g. navigate(`/entries/${id}/history`) */ };
  const handleEmail       = async id => {
    try {
      await emailSalaryById(id);
      alert('Email sent');
    } catch {
      alert('Email failed');
    }
  };

  if (loading) return <p>Loading entries…</p>;
  if (error)   return <p className="error">{error}</p>;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const visible    = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="entries-container">
      <h1>Entries</h1>

      <div className="entries-controls">
        <input
          type="text"
          placeholder="Search…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="buttons">
          <button onClick={handleAddClick}>Add Entry</button>
          <button onClick={handleImport}>Import</button>
          <button onClick={handleExport}>Export</button>
        </div>
        <input
          type="file"
          ref={fileInput}
          style={{ display: 'none' }}
          accept=".xlsx"
          onChange={onFileChange}
        />
      </div>

      <EntryModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdded={() => { setShowAdd(false); fetchEntries(); }}
      />

      <EditEntryModal
        isOpen={Boolean(editEntry)}
        entry={editEntry}
        onClose={() => setEditEntry(null)}
        onUpdated={() => { setEditEntry(null); fetchEntries(); }}
      />

      <table className="entries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Platform</th>
            <th>Ext ID</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(e => {
            const latest = [...e.salaryHistories]
              .sort((a,b) => new Date(b.changedAt) - new Date(a.changedAt))[0];
            return (
              <tr key={e.id}>
                <td>{e.fullName}</td>
                <td>{e.email}</td>
                <td>{e.platform}</td>
                <td>{e.externalId}</td>
                <td>€{latest ? latest.amount.toFixed(2) : '—'}</td>
                <td className="actions">
                  <button onClick={() => handleEditClick(e)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(e.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => handleHistory(e.id)} title="History">
                    <Clock size={16} />
                  </button>
                  <button onClick={() => handleEmail(e.id)} title="Email">
                    <Mail size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </main>
  );
}
