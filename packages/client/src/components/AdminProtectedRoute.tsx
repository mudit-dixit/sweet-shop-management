import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  // This will run while the user is being decoded from the token
  if (!user) {
    // You could show a loading spinner here
    return null;
  }

  // If the user is not an admin, redirect them to the home page
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // If they are an admin, show the child routes
  return <Outlet />;
};