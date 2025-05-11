// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser as apiGetCurrentUser
} from '../services/api'
import { saveAuth, getAuth, clearAuth } from '../utils/auth'

// Create Auth context
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Log in user, save token, set user, redirect
  async function login(credentials) {
    try {
      const { data } = await apiLogin(credentials)
      saveAuth({ token: data.token })
      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      throw err
    }
  }

  // Register user, save token, set user, redirect
  async function register(data) {
    try {
      const { data: res } = await apiRegister(data)
      saveAuth({ token: res.token })
      setUser(res.user)
      navigate('/dashboard')
    } catch (err) {
      throw err
    }
  }

  // Clear auth and redirect to login
  function logout() {
    clearAuth()
    setUser(null)
    navigate('/login')
  }

  // On mount, rehydrate user if token exists
  useEffect(() => {
    const auth = getAuth()
    if (auth && auth.token) {
      apiGetCurrentUser()
        .then(({ data }) => {
          setUser(data.user)
          setLoading(false)
        })
        .catch(() => {
          clearAuth()
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // Show loading state while rehydrating
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

// Convenience hook to consume Auth context
export function useAuth() {
  return useContext(AuthContext)
}
