import './i18n';
import { RouterProvider } from 'react-router';
import { AppProvider } from './context/AppContext';
import { router } from './routes';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </AppProvider>
  );
}
