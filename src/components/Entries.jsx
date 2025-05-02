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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const file = e.target.files[0];
    if (!file) return;
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
      link.href = url;
      link.setAttribute('download', 'entries.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Export failed');
    }
  };

  const handleEdit = (id) => {
    navigate(`/entries/${id}/edit`);
  };

  const handleHistory = (id) => {
    navigate(`/entries/${id}/history`);
  };

  const handleEmail = async (id) => {
    try {
      await emailSalaryById(id);
      alert('Email sent successfully');
    } catch {
      alert('Failed to send email');
    }
  };

  // Pagination
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
          <button onClick={() => setIsModalOpen(true)}>Add Entry</button>
          <button onClick={handleImportClick}>Import</button>
          <button onClick={handleExport}>Export</button>
        </div>

        <input
          type="file"
          ref={fileInput}
          onChange={onFileChange}
          style={{ display: 'none' }}
          accept=".xlsx"
        />
      </div>

      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdded={fetchEntries}
      />

      <table className="entries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Platform</th>
            <th>External ID</th>
            <th>Latest Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map(entry => {
            const latest = entry.salaryHistories
              .slice()
              .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];

            return (
              <tr key={entry.id}>
                <td>{entry.fullName}</td>
                <td>{entry.email}</td>
                <td>{entry.platform}</td>
                <td>{entry.externalId}</td>
                <td>€{latest ? latest.amount.toFixed(2) : '—'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(entry.id)}>Edit</button>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                  <button onClick={() => handleHistory(entry.id)}>History</button>
                  <button onClick={() => handleEmail(entry.id)}>Email</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >Next</button>
      </div>
    </main>
  );
}
