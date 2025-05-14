// src/components/ProfileModal.jsx
import React, { useState, useRef, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getOrgInfo, updateOrganization } from '../services/api'
import './ProfileModal.css'

export default function ProfileModal() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const fileInput = useRef()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({ fullName: user.fullName, email: user.email })
  const [orgData, setOrgData] = useState({ name: '', bio: '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [orgMessage, setOrgMessage] = useState('')

  useEffect(() => {
    getOrgInfo().then(res => {
      setOrgData({
        name: res.data.organization.name,
        bio: res.data.organization.bio || ''
      })
    })
  }, [])

  function close() {
    navigate('/dashboard')
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    // ... avatar upload logic here
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  function handleOrgChange(e) {
    const { name, value } = e.target
    setOrgData(prev => ({ ...prev, [name]: value }))
  }

  async function saveProfile() {
    // ... save user profile logic
  }

  async function savePassword() {
    // ... save password logic
  }

  async function saveOrgInfo() {
    try {
      await updateOrganization({ name: orgData.name, bio: orgData.bio })
      setOrgMessage('Organization updated successfully!')
    } catch (err) {
      setOrgMessage('Failed to update organization.')
    }
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
            <>
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

              <div className="org-form">
                <h3>Edit Organization</h3>
                <label>
                  Organization Name
                  <input
                    name="name"
                    value={orgData.name}
                    onChange={handleOrgChange}
                    required
                  />
                </label>
                <label>
                  Bio
                  <textarea
                    name="bio"
                    value={orgData.bio}
                    onChange={handleOrgChange}
                  />
                </label>
                <button onClick={saveOrgInfo} className="btn save">Update Organization</button>
                {orgMessage && <p className="org-message">{orgMessage}</p>}
              </div>
            </>
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