// src/components/Auth.jsx
import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Auth.css'

export default function Auth({ initialMode = 'login' }) {
  const navigate    = useNavigate()
  const location    = useLocation()
  const { login, register } = useContext(AuthContext)

  const [mode, setMode]           = useState(initialMode)
  const [fullName, setFullName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [inviteToken, setInviteToken] = useState('')
  const [error, setError]         = useState('')
  const [info, setInfo]           = useState('')

  // On mount: pick up ?token= and any success message
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token  = params.get('token')
    if (token) {
      setInviteToken(token)
      setMode('register')
    }
    if (location.state?.success) {
      setInfo(location.state.success)
    }
  }, [location])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setInfo('')

    try {
      if (mode === 'register') {
        await register({ fullName, email, password, inviteToken })
        // if they came via an invite link, send them to login afterward
        if (inviteToken) {
          navigate('/login', {
            state: { success: 'Registration successful! Please log in.' }
          })
        }
      } else {
        await login({ email, password })
        // on success, AuthContext.login will navigate to /dashboard
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <main className="auth-container">
      <div className="auth-box">
        <h2>{mode === 'register' ? 'Create an Account' : 'Welcome Back'}</h2>

        {info && <div className="auth-info">{info}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            {mode === 'register' ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                className="link-btn"
                onClick={() => {
                  setMode('login')
                  setError('')
                  navigate('/login')
                }}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <button
                className="link-btn"
                onClick={() => {
                  setMode('register')
                  setError('')
                  navigate('/register')
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
