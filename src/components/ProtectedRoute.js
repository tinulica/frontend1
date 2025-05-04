// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  if (!user) {
    // redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // ✅ simply return the element(s) you wrapped
  return children
}
