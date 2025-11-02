import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export const Navbar: React.FC = () => {
  // 1. Get the user object
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Sweet Shop
      </Link>
      <div className="flex items-center space-x-4">
        {/* 2. Conditionally show Admin link */}
        {user?.role === 'ADMIN' && (
          <Link to="/admin" className="font-medium text-gray-700 hover:text-blue-600">
            Admin
          </Link>
        )}

        {token ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};