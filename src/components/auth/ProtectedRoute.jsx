import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { Loading } from '../common/Loading.jsx';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Authenticating..." />;
  }

  if (!user) {
    // In a real app, you might redirect to login
    // For now, the parent component will handle this
    return null;
  }

  return children;
};