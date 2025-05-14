import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser as apiGetCurrentUser,
} from '../services/api';
import { saveAuth, getAuth, clearAuth } from '../utils/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(credentials) {
    try {
      const { data } = await apiLogin(credentials);
      saveAuth({ token: data.token });
      setUser(data.user);

      if (!data.user.hasCompletedSetup) {
        navigate('/setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      throw err;
    }
  }

  async function register(regData) {
    try {
      const { data: res } = await apiRegister(regData);
      saveAuth({ token: res.token });
      setUser(res.user);

      if (!res.user.hasCompletedSetup) {
        navigate('/setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      throw err;
    }
  }

  function logout() {
    clearAuth();
    setUser(null);
    navigate('/login');
  }

  useEffect(() => {
    const auth = getAuth();
    if (auth && auth.token) {
      apiGetCurrentUser()
        .then(({ data }) => {
          setUser(data.user);
          if (!data.user.hasCompletedSetup) {
            navigate('/setup');
          }
          setLoading(false);
        })
        .catch(() => {
          clearAuth();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

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

export function useAuth() {
  return useContext(AuthContext);
}
