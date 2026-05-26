import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchAvailableRooms, checkCurrentUser, RoomDTO, User, SearchParams, Booking, fetchMyBookings, fetchAllBookings, updateBookingStatusInBackend } from '../components/service/api';

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  loginWithGoogle: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, lastName: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: number, status: string) => void; 
  rooms: RoomDTO[]; 
  isLoading: boolean;
  error: string | null;
  searchRooms: (checkIn: string, checkOut: string, guests: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchMyBookingsContext = async () => {
    try {
      const data = await fetchMyBookings(); 
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };
  
  const verifyUserSession = async () => {
    try {
      const userData = await checkCurrentUser();
      if (userData.isLoggedIn) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
        
        try {
          let data;
          if (userData.role === 'ADMIN' || userData.role === 'admin' || userData.role === 'ROLE_ADMIN') {
            // Jeśli to szef -> pobierz z bazy absolutnie wszystko
            data = await fetchAllBookings();
          } else {
            // Jeśli to zwykły gość -> pobierz tylko jego rezerwacje
            data = await fetchMyBookings();
          }
          setBookings(data);
        } catch (fetchErr) {
          console.error("Błąd pobierania rezerwacji:", fetchErr);
        }
      } else {
        setUser(null);
        setBookings([]);
      }
    } catch (err) {
      console.error("Brak aktywnej sesji Google lub błąd połączenia z serwerem");
      setUser(null);
      setBookings([]);
    }
  };

  useEffect(() => {
    verifyUserSession();
  }, []);  
  
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const loginWithEmail = async (email: string, password: string) => {
    try{
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Błędne e-mail lub hasło');
      }
      
      await verifyUserSession();
    } catch (err) {
      console.error('Błąd logowania:', err);
      throw new Error('Błędny e-mail lub hasło');
    }
  };

  const registerWithEmail = async (name: string, lastName: string, email: string, password: string, phone: string) => {
    try{
      const response = await fetch('http://localhost:8080/api/auth/register',{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, lastName, email, password, phone }),
      } );
      if (!response.ok) {
        throw new Error('Rejestracja nie powiodła się');
      }
      await loginWithEmail(email, password);
    }catch (err) {
      console.error('Błąd rejestracji:', err);
      throw new Error('Rejestracja nie powiodła się');
    }
  };

  const logout = () => {
    window.location.href = 'http://localhost:8080/logout';
  };

  const addBooking = (booking: Booking) => {
    setBookings([...bookings, booking]);
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      
      await updateBookingStatusInBackend(bookingId, status);
      
      setBookings(prevBookings => {
        const newBookings = prevBookings.map(booking => {
          if (String(booking.id) === String(bookingId)) {
            return { ...booking, status: status };
          }
          return booking;
        });
        
        return newBookings;
      });
      
    } catch (err) {
      throw new Error('Nie można zaktualizować statusu rezerwacji');
    }
  };
  const searchRooms = async (checkIn: string, checkOut: string, guests: number) => {
    setIsLoading(true);
    setError(null);
    
    setSearchParams({ checkIn, checkOut, guests });
    try {
      const availableRooms = await fetchAvailableRooms(checkIn, checkOut, guests);
      setRooms(availableRooms);
    } catch (err) {
      setError('Błąd podczas pobierania dostępnych pokoi');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        searchParams,
        setSearchParams,
        bookings,
        addBooking,
        updateBookingStatus,


        rooms,
        isLoading,
        error,
        searchRooms,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
