import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser
} from '../services/api'
import { saveAuth, getAuth, logout as clearAuth } from '../utils/authStorage'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Logout using storage helper
  const logout = () => {
    clearAuth()
    setUser(null)
    navigate('/', { replace: true })
  }

  // On mount: rehydrate + fetch /auth/me
  useEffect(() => {
    const auth = getAuth()
    if (!auth) {
      setLoading(false)
      return
    }
    setUser(auth.user)
    ;(async () => {
      try {
        const { data } = await getCurrentUser()
        setUser(data.user)
        saveAuth({ token: auth.token, user: data.user })
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // --- LOGIN ---
  const login = async ({ email, password }) => {
    const { data } = await apiLogin({ email, password })
    if (!data?.token || !data?.user) {
      throw new Error('Invalid login response')
    }
    saveAuth({ token: data.token, user: data.user })
    setUser(data.user)
    navigate('/dashboard', { replace: true })
  }

  // --- REGISTER ---
  const register = async ({ fullName, email, password, inviteToken }) => {
    const payload = { fullName, email, password }
    if (inviteToken) payload.token = inviteToken
    const { data } = await apiRegister(payload)
    if (!data?.token || !data?.user) {
      throw new Error('Invalid registration response')
    }
    saveAuth({ token: data.token, user: data.user })
    setUser(data.user)
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
