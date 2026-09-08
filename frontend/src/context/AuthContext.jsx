import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredUser, setStoredUser, setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (localStorage.getItem('swayamcraft_token')) {
          const profile = await api.getProfile();
          setUser(profile);
          setStoredUser(profile);
        }
      } catch (err) {
        console.error('Session validation error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const authData = await api.login(credentials);
    setAuthToken(authData.token);
    setUser(authData);
    setStoredUser(authData);
    return authData;
  };

  const register = async (userData) => {
    const authData = await api.register(userData);
    setAuthToken(authData.token);
    setUser(authData);
    setStoredUser(authData);
    return authData;
  };

  const logout = () => {
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
  };

  const isSeller = user?.roles?.some((r) => r === 'ROLE_SELLER' || r === 'ROLE_ADMIN');
  const isAdmin = user?.roles?.some((r) => r === 'ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isSeller,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
