import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Homepage } from './pages/Homepage';
import { RoomDetails } from './pages/RoomDetails';
import { Checkout } from './pages/Checkout';
import { UserDashboard } from './pages/UserDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Homepage },
      { path: 'room/:id', Component: RoomDetails },
      { path: 'checkout', Component: Checkout },
      { path: 'dashboard', Component: UserDashboard },
      { path: 'admin', Component: AdminPanel },
      { path: '*', Component: NotFound },
    ],
  },
]);
