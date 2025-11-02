import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();

  // If there's a token, show the child route (e.g., Dashboard)
  if (token) {
    return <Outlet />;
  }

  // If no token, redirect to the login page
  return <Navigate to="/login" replace />;
};