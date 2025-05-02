// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Entries from './components/Entries';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Root: redirect logged-in users, else show Home */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Home />}
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Auth mode="login" />
          }
        />
        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Auth mode="register" />
          }
        />

        {/* Protected routes */}
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

        {/* Fallback: send logged-in users to dashboard, guests to login */}
        <Route
          path="*"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
