// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser
} from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Persist token + user
  const persist = (token, me) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(me))
    setUser(me)
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/', { replace: true })
  }

  // On mount: rehydrate + fetch /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}

    }
    ;(async () => {
      try {
        const { data } = await getCurrentUser()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // --- LOGIN ---  
  // returns null on success, or error message
  const login = async ({ email, password }) => {
    try {
      const { data } = await apiLogin({ email, password })
      persist(data.token, data.user)
      return null
    } catch (err) {
      return err.response?.data?.message || err.message
    }
  }

  // --- REGISTER ---  
  // returns null on success, or error message
  const register = async ({ fullName, email, password, inviteToken }) => {
    try {
      const payload = { fullName, email, password }
      if (inviteToken) payload.token = inviteToken
      const { data } = await apiRegister(payload)
      persist(data.token, data.user)
      return null
    } catch (err) {
      return err.response?.data?.message || err.message
    }
  }

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
