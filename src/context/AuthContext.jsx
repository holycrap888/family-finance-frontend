import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (authService.isAuthenticated()) {
      const result = await authService.getCurrentUser();
      if (result.success) {
        setUser(result.user);
      } else {
        authService.logout();
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.login(email, password);
    
    if (result.success) {
      const userResult = await authService.getCurrentUser();
      if (userResult.success) {
        setUser(userResult.user);
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.register(userData);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  const value = React.useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  }), [user, loading, error, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
