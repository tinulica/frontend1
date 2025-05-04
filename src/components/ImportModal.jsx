// src/components/ImportModal.jsx
import React, { useState } from 'react'
import axios from 'axios'
import './ImportModal.css'

const PLATFORMS = ['GLOVO', 'TAZZ', 'BRINGO', 'ANGAJAT']

export default function ImportModal({ isOpen, onClose, onImported }) {
  const [activeTab, setActiveTab] = useState(PLATFORMS[0])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.')
      return
    }
    setError(null)
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post(`/import/${activeTab.toLowerCase()}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onImported()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="import-modal-overlay" onClick={onClose}>
      <aside className="import-modal" onClick={e => e.stopPropagation()}>
        <header className="import-header">
          <h2>Import Entries</h2>
          <button className="import-close" onClick={onClose}>×</button>
        </header>

        <nav className="import-tabs">
          {PLATFORMS.map(p => (
            <button
              key={p}
              className={p === activeTab ? 'tab active' : 'tab'}
              onClick={() => setActiveTab(p)}
            >
              {p}
            </button>
          ))}
        </nav>

        <div className="import-body">
          <p>Select your <strong>{activeTab}</strong> import file (Excel/CSV):</p>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={e => setFile(e.target.files[0])}
          />
          {error && <p className="import-error">{error}</p>}
        </div>

        <footer className="import-actions">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleUpload} disabled={loading}>
            {loading ? 'Importing...' : 'Import'}
          </button>
        </footer>
      </aside>
    </div>
  )
}

