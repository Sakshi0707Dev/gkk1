import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

const AuthContext = createContext(null);

const TOKEN_KEY = 'agri_token';
const USER_KEY = 'agri_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const logout = useCallback(async (redirectTo = '/') => {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      if (token && !token.startsWith('google_token_')) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore errors
    } finally {
      clearAuth();
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    }
  }, [clearAuth]);

  const login = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const savedUserRaw = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        if (!savedUserRaw || !token) {
          setIsLoading(false);
          return;
        }

        let savedUser;
        try {
          savedUser = JSON.parse(savedUserRaw);
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setIsLoading(false);
          return;
        }

        setUser(savedUser);
        setIsAuthenticated(true);

        if (!token.startsWith('google_token_')) {
          try {
            const res = await axios.get(`${API_URL}/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const freshUser = res.data.data.user;
            setUser(freshUser);
            localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          } catch {
            clearAuth();
          }
        }
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};