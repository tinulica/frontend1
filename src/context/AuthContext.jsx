// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Initialize from localStorage, if present
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Perform logout: clear storage + state + redirect
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth');
  };

  // Login handler
  const login = async ({ email, password }) => {
    try {
      const { data } = await apiLogin({ email, password });
      const { token, user: me } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(me));
      setUser(me);
      navigate('/dashboard');
      return null;   // no error
    } catch (err) {
      // Return error message back to caller
      return err.response?.data?.message || err.message;
    }
  };

  // Register handler (supports optional inviteToken)
  const register = async ({ fullName, email, password, inviteToken }) => {
    try {
      const payload = { fullName, email, password };
      if (inviteToken) payload.token = inviteToken;
      const { data } = await apiRegister(payload);
      const { token, user: me } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(me));
      setUser(me);
      navigate('/dashboard');
      return null;
    } catch (err) {
      return err.response?.data?.message || err.message;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
