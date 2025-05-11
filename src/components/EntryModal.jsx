// src/components/EntryModal.jsx
import React, { useState } from 'react'
import { addEntry } from '../services/api'

// Inline styles for modal UI (can be moved to CSS)
const backdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
}
const modalStyle = {
  background: '#fff', padding: '2rem', borderRadius: '8px',
  width: '90%', maxWidth: '400px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
}
const formGroupStyle = { marginBottom: '1rem', display: 'flex', flexDirection: 'column' }
const errorStyle = { color: 'red', marginBottom: '1rem' }
const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }
const cancelStyle = { padding: '0.5rem 1rem' }
const submitStyle = { padding: '0.5rem 1rem', background: '#007bff', color: '#fff', border: 'none' }

export default function EntryModal({ isOpen, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: 'Glovo',
    externalId: ''
  })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await addEntry({
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        platform: formData.platform,
        externalId: formData.externalId
      })
      onAdded()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h2>Add Entry</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label>Nume și Prenume</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label>Adresa de email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label>Numar de telefon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label>Platforma</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            >
              <option value="Glovo">Glovo</option>
              <option value="Bolt">Bolt</option>
              <option value="Bringo">Bringo</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label>Id Platforma</label>
            <input
              type="text"
              name="externalId"
              value={formData.externalId}
              onChange={handleChange}
            />
          </div>
          {error && <p style={errorStyle}>{error}</p>}
          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelStyle}>Cancel</button>
            <button type="submit" style={submitStyle}>Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}
