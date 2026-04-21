import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useApp } from '../context/AppContext';

export const UserDashboard: React.FC = () => {
  const { user, bookings, isLoggedIn } = useApp();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-12 border border-gray-100 max-w-md">
          <h2 className="text-3xl font-serif mb-4">Zaloguj się</h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
            Aby zarządzać swoimi pobytami
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-primary text-white py-3 px-8 text-sm uppercase tracking-widest hover:bg-accent transition-colors"
          >
            Powrót
          </button>
        </div>
      </div>
    );
  }

  const userBookings = bookings.filter((b) => b.userId === user?.id);
  const upcomingBookings = userBookings.filter((b) => new Date(b.checkIn) >= new Date());
  const pastBookings = userBookings.filter((b) => new Date(b.checkIn) < new Date());

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'confirmed': return 'text-blue-600';
      case 'pending': return 'text-accent';
      default: return 'text-gray-400';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'paid': return 'Opłacone';
      case 'confirmed': return 'Potwierdzone';
      case 'pending': return 'Oczekuje';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="mb-16">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 hover:text-accent p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-xs uppercase tracking-widest">Wróć do strony głównej</span>
          </Button>
          <h1 className="text-5xl font-serif mb-2">Witaj, {user?.name}</h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
            Twoja historia i planowane pobyty w Hotelu Luks
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Wszystkie rezerwacje</p>
            <p className="text-3xl font-serif text-primary">{userBookings.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Nadchodzące pobyty</p>
            <p className="text-3xl font-serif text-accent">{upcomingBookings.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Suma wydatków</p>
            <p className="text-3xl font-serif text-primary">
              {userBookings.reduce((sum, b) => sum + b.totalPrice, 0)} zł
            </p>
          </div>
        </div>

        {}
        <div className="mb-24">
          <h2 className="text-2xl font-serif mb-8 border-b border-gray-100 pb-4">Nadchodzące pobyty</h2>
          {upcomingBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Apartament</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Termin</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Kwota</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.map((booking) => (
                    <TableRow key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/30">
                      <TableCell className="text-[10px] font-mono text-gray-400">#{booking.id.slice(-6)}</TableCell>
                      <TableCell className="font-medium">{booking.roomName}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{booking.checkIn} — {booking.checkOut}</TableCell>
                      <TableCell className="font-serif font-bold text-primary">{booking.totalPrice} zł</TableCell>
                      <TableCell className="text-right">
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${getStatusStyle(booking.status)}`}>
                          {getStatusName(booking.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 border border-dashed border-gray-200 text-center">
              <p className="font-serif italic text-gray-400">Brak zaplanowanych pobytów</p>
            </div>
          )}
        </div>

        {}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif mb-8 border-b border-gray-100 pb-4 text-gray-400">Historia pobytów</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id} className="border-b border-gray-50 opacity-60">
                      <TableCell className="py-4 text-gray-500">{booking.roomName}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{booking.checkIn} — {booking.checkOut}</TableCell>
                      <TableCell className="text-gray-500 font-serif">{booking.totalPrice} zł</TableCell>
                      <TableCell className="text-right">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                          Zakończono
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* No Bookings Case */}
        {userBookings.length === 0 && (
          <div className="py-32 text-center">
            <h3 className="text-3xl font-serif mb-6">Nie masz jeszcze żadnych rezerwacji</h3>
            <Button
              onClick={() => navigate('/')}
              className="bg-primary text-white rounded-none px-10 py-6 text-sm uppercase tracking-widest hover:bg-accent"
            >
              Przeglądaj Apartamenty
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};