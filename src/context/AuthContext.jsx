import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser
} from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist token + user in localStorage and state
  const persist = (token, me) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(me));
    setUser(me);
  };

  // Logout and clear storage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // On mount: rehydrate then fetch fresh user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Try rehydrate from storage
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }

    // Fetch current user
    (async () => {
      try {
        const { data } = await getCurrentUser();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, []); // only on mount

  // --- LOGIN ---
  const login = async ({ email, password }) => {
    const { data } = await apiLogin({ email, password });
    persist(data.token, data.user);
    navigate('/dashboard');
  };

  // --- REGISTER ---
  const register = async ({ fullName, email, password, inviteToken }) => {
    const payload = { fullName, email, password };
    if (inviteToken) payload.token = inviteToken;
    const { data } = await apiRegister(payload);
    persist(data.token, data.user);
    navigate('/dashboard');
  };

  // While loading (rehydrating/fetching), show placeholder
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
