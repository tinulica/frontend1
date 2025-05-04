// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login    as apiLogin,
  register as apiRegister,
  getCurrentUser
} from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist token + user
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

  // On mount: rehydrate then fetch /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // rehydrate from storage
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }

    // refresh from server
    (async () => {
      try {
        const { data } = await getCurrentUser();
        const { user: me } = data;
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch (err) {
        console.error('Could not fetch current user', err);
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- LOGIN ---
  const login = async ({ email, password }) => {
    try {
      const { data } = await apiLogin({ email, password });
      const { token, user: me } = data;
      persist(token, me);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      throw new Error(msg);
    }
  };

  // --- REGISTER ---
  // inviteToken is passed for invite‑only sign‑ups
  const register = async ({ fullName, email, password, inviteToken }) => {
    try {
      const payload = { fullName, email, password };
      if (inviteToken) payload.token = inviteToken;
      const { data } = await apiRegister(payload);
      const { token, user: me } = data;

+     // If this was an invite, *do not* persist or navigate here.
+     // Let your Home form detect success and redirect to /login.
+     if (inviteToken) {
+       return;
+     }

      // otherwise, a self‑signup → auto‑login & dashboard
      persist(token, me);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      throw new Error(msg);
    }
  };

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
