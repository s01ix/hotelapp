import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, mockBookings } from '../data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: 'paid' | 'pending' | 'confirmed') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const login = (email: string, _password: string) => {
    // Mock login - check if admin or regular user
    if (email.includes('admin')) {
      setUser({
        id: 'admin1',
        name: 'Admin User',
        email: email,
        role: 'admin',
      });
    } else {
      setUser({
        id: 'user1',
        name: 'John Smith',
        email: email,
        role: 'user',
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addBooking = (booking: Booking) => {
    setBookings([...bookings, booking]);
  };

  const updateBookingStatus = (bookingId: string, status: 'paid' | 'pending' | 'confirmed') => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        login,
        logout,
        searchParams,
        setSearchParams,
        bookings,
        addBooking,
        updateBookingStatus,
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
