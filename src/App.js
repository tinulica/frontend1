import React, { useContext, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthContext } from './context/AuthContext'

// Lazy-loaded page components
const Home = lazy(() => import('./components/Home'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Entries = lazy(() => import('./components/Entries'))
const Notifications = lazy(() => import('./components/Notifications'))
const ProfileModal = lazy(() => import('./components/ProfileModal'))
const OrgSetup = lazy(() => import('./components/OrgSetup'))

export default function App() {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  const needsSetup = user && !user.hasCompletedSetup
  const isAuthRoute = ["/", "/login", "/register"].includes(location.pathname)

  return (
    <>
      {/* Show navbar only if logged in and setup is complete */}
      {user && user.organizationId && user.hasCompletedSetup && <Navbar />}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Landing / Auth */}
          <Route
            path="/"
            element={user ? (
              needsSetup ? <Navigate to="/setup" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <Home />
            )}
          />
          <Route
            path="/login"
            element={user ? (
              needsSetup ? <Navigate to="/setup" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <Home />
            )}
          />
          <Route
            path="/register"
            element={user ? (
              needsSetup ? <Navigate to="/setup" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <Home />
            )}
          />

          {/* Organization setup required before accessing other routes */}
          {user && needsSetup && (
            <>
              <Route path="/setup" element={<OrgSetup />} />
              <Route path="*" element={<Navigate to="/setup" replace />} />
            </>
          )}

          {/* Protected */}
          {!needsSetup && (
            <>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entries"
                element={
                  <ProtectedRoute>
                    <Entries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileModal />
                  </ProtectedRoute>
                }
              />
            </>
          )}

          {/* Fallback */}
          <Route
            path="*"
            element={
              user
                ? <Navigate to={needsSetup ? "/setup" : "/dashboard"} replace />
                : <Navigate to="/" replace />
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}
