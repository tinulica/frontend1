// src/components/ProfileModal.jsx
import React, { useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './ProfileModal.css'

export default function ProfileModal() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const fileInput = useRef()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({ fullName: user.fullName, email: user.email })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  // Close the profile modal by navigating back to dashboard
  function close() {
    navigate('/dashboard')
  }

  // Handle avatar selection
  function handleAvatarChange(e) {
    const file = e.target.files[0]
    // ... upload logic
  }

  // Handle password change fields
  function handlePasswordChange(e) {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  // Submit profile updates
  async function saveProfile() {
    // ... save logic
  }

  // Submit password update
  async function savePassword() {
    // ... password logic
  }

  return (
    <div className="profile-backdrop">
      <div className="profile-container">
        <header className="profile-header">
          <h2>Profile Settings</h2>
        </header>
        <nav className="profile-tabs">
          <button onClick={() => setActiveTab('profile')}>Profile</button>
          <button onClick={() => setActiveTab('password')}>Password</button>
        </nav>
        <main className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-form">
              <label>
                Name
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </label>
              <label>
                Avatar
                <input
                  type="file"
                  ref={fileInput}
                  onChange={handleAvatarChange}
                />
              </label>
              <button onClick={saveProfile} className="btn save">Save</button>
            </div>
          )}
          {activeTab === 'password' && (
            <div className="password-form">
              <label>
                Current Password
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  name="next"
                  value={passwords.next}
                  onChange={handlePasswordChange}
                />
              </label>
              <label>
                Confirm New
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                />
              </label>
              <button onClick={savePassword} className="btn save">Change Password</button>
            </div>
          )}
        </main>
        <footer className="profile-actions">
          <button onClick={logout} className="btn logout">Logout</button>
          <button onClick={close} className="btn cancel">Close</button>
        </footer>
      </div>
    </div>
  )
}
