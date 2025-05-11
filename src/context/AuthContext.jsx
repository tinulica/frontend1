import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiLogin, apiRegister, apiGetCurrentUser } from '../services/api'
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
      const { token, user } = await apiLogin(credentials)
      saveAuth({ token })
      setUser(user)
      navigate('/dashboard')
    } catch (err) {
      // Handle login error (e.g. show notification)
      throw err
    }
  }

  // Register user, save token, set user, redirect
  async function register(data) {
    try {
      const { token, user } = await apiRegister(data)
      saveAuth({ token })
      setUser(user)
      navigate('/dashboard')
    } catch (err) {
      // Handle registration error
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
        .then(({ user }) => {
          setUser(user)
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
