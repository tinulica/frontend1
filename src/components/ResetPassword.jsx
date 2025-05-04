// src/components/ResetPassword.jsx
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/api'
import './Auth.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const token = params.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (!token) {
      setError('No reset token provided.')
    }
  }, [token])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!token) return

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      const { data } = await resetPassword({ token, newPassword })
      setInfo(data.message || 'Your password has been reset.')
      // redirect to login after a short delay
      setTimeout(() => navigate('/login', { replace: true }), 2500)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  // If there's no token at all, just show the error
  if (!token) {
    return (
      <main className="auth-container">
        <h2>Reset Password</h2>
        <p className="error-message">{error}</p>
      </main>
    )
  }

  return (
    <main className="auth-container">
      <h2>Reset Password</h2>

      {info && <p className="info-message">{info}</p>}

      {!info && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>
      )}
    </main>
  )
}
