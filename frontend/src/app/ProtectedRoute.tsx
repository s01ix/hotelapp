import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useApp } from './context/AppContext';

interface ProtectedRouteProps {
  allowedRoles?: ('user' | 'admin' | 'USER' | 'ADMIN' | 'receptionist' | 'RECEPTIONIST')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoggedIn, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 uppercase tracking-widest text-xs animate-pulse">
          Weryfikacja uprawnień...
        </p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(user.role.toUpperCase())) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};