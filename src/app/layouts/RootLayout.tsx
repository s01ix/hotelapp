import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};
