// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Initialize user from localStorage (if any)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Helper to persist user+token
  const persist = (token, me) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(me));
    setUser(me);
  };

  // Log out
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // Log in: throws on error
  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    const { token, user: me } = data;
    persist(token, me);
    navigate('/dashboard');
  };

  // Register: throws on error; optional inviteToken
  const register = async (fullName, email, password, inviteToken) => {
    const payload = { fullName, email, password };
    if (inviteToken) payload.token = inviteToken;
    const { data } = await apiRegister(payload);
    const { token, user: me } = data;
    persist(token, me);
    navigate('/dashboard');
  };

  // If token/user exist, always stay logged in across reloads
  useEffect(() => {
    if (user) {
      // you could re‑validate token here if needed
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
