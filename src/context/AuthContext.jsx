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
  const [user, setUser] = useState(null)
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
  // Throws on error
  const login = async ({ email, password }) => {
    const { data } = await apiLogin({ email, password })
    if (!data?.token || !data?.user) {
      throw new Error('Invalid login response')
    }
    persist(data.token, data.user)
    // Navigate to dashboard after successful login
    navigate('/dashboard', { replace: true })
  }

  // --- REGISTER ---
  // Throws on error
  const register = async ({ fullName, email, password, inviteToken }) => {
    const payload = { fullName, email, password }
    if (inviteToken) payload.token = inviteToken
    const { data } = await apiRegister(payload)
    if (!data?.token || !data?.user) {
      throw new Error('Invalid registration response')
    }
    persist(data.token, data.user)
    // After registering via invite, navigate to login screen
    if (inviteToken) {
      navigate('/login', {
        state: { success: 'Registration successful! Please log in.' }
      })
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
