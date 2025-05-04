import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
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
import {
  Edit2,
  Trash2,
  Clock,
  Mail,
  Search,
  Plus,
  Upload,
  Download
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Entries.css';

// define each tab's filter key and display label
const TABS = [
  { key: 'GLOVO',   label: 'Glovo' },
  { key: 'TAZZ',    label: 'Tazz' },
  { key: 'BRINGO',  label: 'Bringo' },
  { key: 'ANGAJAT', label: 'Angajat' }
];

export default function Entries() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries]           = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [editEntry, setEditEntry]       = useState(null);
  const [activeTab, setActiveTab]       = useState(TABS[0].key);
  const [selectedIds, setSelectedIds]   = useState(new Set());
  const fileInput = useRef();
  const pageSize  = 10;

  // Fetch entries once on mount
  async function fetchEntries() {
    setLoading(true);
    try {
      const { data } = await getEntries();
      setEntries(data);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(fetchEntries, []);

  // Real‑time subscriptions
  useEffect(() => {
    if (!user) return;
    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') }
    });
    socket.emit('joinOrg', user.organizationId);
    ['entryAdded','entryUpdated','entryDeleted'].forEach(evt =>
      socket.on(evt, fetchEntries)
    );
    return () => {
      ['entryAdded','entryUpdated','entryDeleted'].forEach(evt =>
        socket.off(evt, fetchEntries)
      );
      socket.disconnect();
    };
  }, [user]);

  // Filter by tab + search
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return entries
      .filter(e => e.platform === activeTab)
      .filter(e =>
        e.fullName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        (e.externalId || '').toLowerCase().includes(term)
      );
  }, [entries, activeTab, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const visible = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  // Average salary for this tab
  const avgSalary = useMemo(() => {
    const sums = entries
      .filter(e => e.platform === activeTab)
      .map(e => {
        const latest = [...e.salaryHistories]
          .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];
        return latest ? latest.amount : 0;
      });
    if (!sums.length) return '0.00';
    return (sums.reduce((a, b) => a + b, 0) / sums.length).toFixed(2);
  }, [entries, activeTab]);

  // handlers for bulk selection
  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedIds(new Set(filtered.map(ent => ent.id)));
    } else {
      setSelectedIds(new Set());
    }
  };
  const handleSelectOne = (id, checked) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };
  const handleBulkDelete = async () => {
    if (!window.confirm('Delete selected entries?')) return;
    for (let id of selectedIds) {
      await deleteEntry(id);
    }
    fetchEntries();
  };

  // Import / export handlers
  const handleImport = () => fileInput.current.click();
  const onFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('platform', activeTab);
    try {
      await apiImportEntries(form);
      fetchEntries();
    } catch {
      alert('Import failed');
    }
  };

  const handleExport = async () => {
    try {
      const resp = await apiExportEntries({ platform: activeTab });
      const url  = URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeTab.toLowerCase()}-entries.xlsx`;
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

  if (loading) return <p className="loading">Loading entries…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <main className="entries-container">
      {/* PLATFORM TABS */}
      <div className="platform-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`plat-tab${tab.key === activeTab ? ' active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setPage(1); setSelectedIds(new Set()); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* HEADER & STATS */}
      <div className="entries-header">
        <h1>{TABS.find(t => t.key === activeTab).label} Entries</h1>
        <div className="stats-cards">
          <div className="stat-card">
            <p className="stat-label">Count</p>
            <p className="stat-value">{filtered.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Avg. Salary</p>
            <p className="stat-value">€{avgSalary}</p>
          </div>
        </div>
      </div>

      {/* CONTROLS & BULK ACTION */}
      <div className="entries-controls">
        <div className="search-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions-wrapper">
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Entry
          </button>
          <button className="btn" onClick={handleImport}>
            <Upload size={16} /> Import
          </button>
          <button className="btn" onClick={handleExport}>
            <Download size={16} /> Export
          </button>
          {selectedIds.size > 0 && (
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              <Trash2 size={16} /> Delete ({selectedIds.size})
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInput}
          style={{ display: 'none' }}
          accept=".xlsx"
          onChange={onFileChange}
        />
      </div>

      {/* MODALS */}
      <EntryModal
        isOpen={showAdd}
        platform={activeTab}
        onClose={() => setShowAdd(false)}
        onAdded={() => { setShowAdd(false); fetchEntries(); }}
      />
      <EditEntryModal
        isOpen={!!editEntry}
        entry={editEntry}
        onClose={() => setEditEntry(null)}
        onUpdated={() => { setEditEntry(null); fetchEntries(); }}
      />

      {/* ENTRIES TABLE */}
      <div className="table-container">
        <table className="entries-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Ext ID</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(e => {
              const latest = [...e.salaryHistories]
                .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];
              return (
                <tr key={e.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(e.id)}
                      onChange={a => handleSelectOne(e.id, a.target.checked)}
                    />
                  </td>
                  <td>{e.fullName}</td>
                  <td>{e.email}</td>
                  <td>{e.externalId || '—'}</td>
                  <td>€{latest ? latest.amount.toFixed(2) : '—'}</td>
                  <td className="actions">
                    <button onClick={() => setEditEntry(e)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(e.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => {/* history… */}} title="History">
                      <Clock size={16} />
                    </button>
                    <button onClick={() => emailSalaryById(e.id)} title="Email">
                      <Mail size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
        >Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >Next</button>
      </div>
    </main>
  );
}
