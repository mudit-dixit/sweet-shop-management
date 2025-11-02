import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicOnlyRoute: React.FC = () => {
  const { token } = useAuth();

  // If there's a token, redirect to the dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  // If no token, show the child route (e.g., Login/Register)
  return <Outlet />;
};