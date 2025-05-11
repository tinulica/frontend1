// src/components/EntryModal.jsx
import React, { useState } from 'react'
import { addEntry } from '../services/api'
import './EntryModal.css'

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
    <div className="em-backdrop" onClick={onClose}>
      <div className="em-modal" onClick={e => e.stopPropagation()}>
        <h2 className="em-title">Add Entry</h2>
        <form onSubmit={handleSubmit} className="em-form">
          <div className="em-field">
            <label>Nume și Prenume</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="em-field">
            <label>Adresa de email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="em-field">
            <label>Numar de telefon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="em-field">
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
          <div className="em-field">
            <label>Id Platforma</label>
            <input
              type="text"
              name="externalId"
              value={formData.externalId}
              onChange={handleChange}
            />
          </div>
          {error && <p className="em-error">{error}</p>}
          <div className="em-actions">
            <button type="button" onClick={onClose} className="em-btn em-cancel">Cancel</button>
            <button type="submit" className="em-btn em-submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}
