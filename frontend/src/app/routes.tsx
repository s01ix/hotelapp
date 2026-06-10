import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Homepage } from './pages/Homepage';
import { RoomDetails } from './pages/RoomDetails';
import { Checkout } from './pages/Checkout';
import { UserDashboard } from './pages/UserDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { AdminRoomsPanel } from './pages/AdminRoomsPanel';
import { NotFound } from './pages/NotFound';
import { ReceptionistPanel } from './pages/ReceptionistPanel';
import { AdminUserPanel } from './pages/AdminUserPanel';
import { AdminLocationsPanel } from './pages/AdminLocationsPanel'
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      //ścierzki dla gości (niezalogowanych)
      { index: true, Component: Homepage },
      { path: 'room/:id', Component: RoomDetails },
      { path: '*', Component: NotFound },

     //ścierzki dla zalogowanych (USER, RECEPTIONIST, ADMIN)
      {
        element: <ProtectedRoute allowedRoles={['USER', 'RECEPTIONIST', 'ADMIN']} />,
        children: [
          { path: 'checkout', Component: Checkout },
          { path: 'dashboard', Component: UserDashboard },
        ],
      },
      //ścierzki dla recepcjonistów i adminów
      {
        element: <ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']} />,
        children: [
          { path: 'receptionist', Component: ReceptionistPanel },
        ],
      },
      //ścierzki tylko dla adminów
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          { path: 'admin', Component: AdminPanel },
          { path: 'admin/rooms', Component: AdminRoomsPanel },
          { path: 'admin/locations', Component: AdminLocationsPanel },
          { path: 'admin/users', Component: AdminUserPanel },
        ],
      },
    ],
  },
]);
