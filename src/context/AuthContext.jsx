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

  // user = { id, email, fullName, organizationId, isOwner, ... }
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: persist token + user in storage & state
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

  // Load any existing token + user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Try to rehydrate user from localStorage first
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    // Then fetch /auth/me for the freshest profile
    (async () => {
      try {
        const { data } = await getCurrentUser();
        const { user: me } = data;
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch (err) {
        console.error('Could not fetch current user', err);
        // token might be expired → force logout
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /**
   * Log in a user.
   * @param {{email:string,password:string}} creds
   * @returns {Promise<string|null>} error message, or null on success
   */
  const login = async ({ email, password }) => {
    try {
      const { data } = await apiLogin({ email, password });
      const { token, user: me } = data;
      persist(token, me);
      navigate('/dashboard');
      return null;
    } catch (err) {
      return err.response?.data?.message || err.message;
    }
  };

  /**
   * Register a new user (with optional invite token).
   * @param {{fullName:string,email:string,password:string,inviteToken?:string}} info
   * @returns {Promise<string|null>} error message, or null on success
   */
  const register = async ({ fullName, email, password, inviteToken }) => {
    try {
      const payload = { fullName, email, password };
      if (inviteToken) payload.token = inviteToken;
      const { data } = await apiRegister(payload);
      const { token, user: me } = data;
      persist(token, me);
      navigate('/dashboard');
      return null;
    } catch (err) {
      return err.response?.data?.message || err.message;
    }
  };

  // Expose context value
  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
