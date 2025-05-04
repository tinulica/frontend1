// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Load user from localStorage if present
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Persist token + user in storage & state
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
