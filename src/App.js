// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar         from './components/Navbar';
import Home           from './components/Home';
import Dashboard      from './components/Dashboard';
import Entries        from './components/Entries';
import ProfileModal   from './components/ProfileModal';
import Notifications  from './components/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* Show navbar if logged in */}
      {user && <Navbar />}

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

        {/* Protected */}
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

        {/* Fallback */}
        <Route
          path="*"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/" replace />
          }
        />
      </Routes>
    </>
  );
}
