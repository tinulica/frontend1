""import React, { useContext, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

// Lazy-loaded page components
const Home = lazy(() => import('./components/Home'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Entries = lazy(() => import('./components/Entries'));
const Notifications = lazy(() => import('./components/Notifications'));
const ProfileModal = lazy(() => import('./components/ProfileModal'));
const OrgSetup = lazy(() => import('./components/OrgSetup'));

export default function App() {
  const { user } = useContext(AuthContext);

  const needsOrgSetup = user && !user.organizationId;

  return (
    <>
      {/* Show navbar if logged in and user has org */}
      {user && user.organizationId && <Navbar />}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Landing / Auth */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Home />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Home />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Home />}
          />

          {/* Org Setup Step for new users */}
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                {needsOrgSetup ? <OrgSetup /> : <Navigate to="/dashboard" replace />}
              </ProtectedRoute>
            }
          />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {needsOrgSetup ? <Navigate to="/setup" replace /> : <Dashboard />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/entries"
            element={
              <ProtectedRoute>
                {needsOrgSetup ? <Navigate to="/setup" replace /> : <Entries />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                {needsOrgSetup ? <Navigate to="/setup" replace /> : <Notifications />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {needsOrgSetup ? <Navigate to="/setup" replace /> : <ProfileModal />}
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              user
                ? (needsOrgSetup ? <Navigate to="/setup" replace /> : <Navigate to="/dashboard" replace />)
                : <Navigate to="/" replace />
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
