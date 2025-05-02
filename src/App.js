// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import AuthScreen from './components/AuthScreen';
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
        {/* If logged in, redirect “/” to dashboard, else show Home */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Home />}
        />

        {/* If logged in, redirect “/auth” to dashboard, else show AuthScreen */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <AuthScreen />}
        />

        {/* Protected data routes */}
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

        {/* Fallback: any unknown path → either dashboard (if logged in) or auth */}
        <Route
          path="*"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/auth" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
