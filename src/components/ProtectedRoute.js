import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  const auth = getAuth();
  return auth ? children : <Navigate to="/login" replace />;
}
