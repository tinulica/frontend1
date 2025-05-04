// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar         from './components/Navbar';
import Home           from './components/Home';
// import Auth         from './components/Auth';    ← no longer used
import Dashboard      from './components/Dashboard';
import Entries        from './components/Entries';
import ProfileModal   from './components/ProfileModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <Navbar />}

      <Routes>
        {/* Landing, Login & Register all use Home */}
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

        {/* Profile modal */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileModal />
            </ProtectedRoute>
          }
        />

        {/* Protected app */}
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

        {/* Catch‐all: guests → home, users → dashboard */}
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
