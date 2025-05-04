// src/components/Home.jsx
import React, { useState, useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ResetPassword from './ResetPassword'
import './Home.css'
import illustration from '../assets/auth-illustration.png'

export default function Home() {
  const { login, register } = useContext(AuthContext)
  const navigate            = useNavigate()
  const { search }          = useLocation()
  const params              = new URLSearchParams(search)
  const inviteToken         = params.get('token') || ''

  // tab mode: 'login' or 'register'
  const [mode, setMode]         = useState(inviteToken ? 'register' : 'login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  // forgot‑pw modal
  const [showReset, setShowReset] = useState(false)

  // if URL had ?token=..., force register
  useEffect(() => {
    if (inviteToken) {
      setMode('register')
      setError('')
    }
  }, [inviteToken])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        await login({ email, password })
        // AuthContext will navigate to /dashboard
      } else {
        await register({ fullName, email, password, inviteToken })
        if (inviteToken) {
          // after invite‐based register, send them to sign‑in
          setMode('login')
        }
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="home-container">
      <div className="auth-card">
        <div
          className="auth-left"
          style={{ backgroundImage: `url(${illustration})` }}
        />
        <div className="auth-right">
          <div className="auth-tabs">
            <button
              className={`tab ${mode === 'login'    ? 'active' : ''}`}
              onClick={() => { setMode('login');    setError('') }}
            >
              Sign In
            </button>
            <button
              className={`tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError('') }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="forgot-password">
              <button
                type="button"
                className="link-btn"
                onClick={() => setShowReset(true)}
              >
                Forgot password?
              </button>
            </div>
          )}

          <div className="auth-footer">
            {mode === 'login' ? (
              <>Don’t have an account?{' '}
                <button
                  className="switch-btn"
                  onClick={() => { setMode('register'); setError('') }}
                >
                  Register
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button
                  className="switch-btn"
                  onClick={() => { setMode('login'); setError('') }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showReset && (
        <ResetPassword onClose={() => setShowReset(false)} />
      )}
    </div>
  )
}
