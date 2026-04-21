import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, X, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useApp } from '../context/AppContext';

export const AdminPanel: React.FC = () => {
  const { user, bookings, updateBookingStatus, isLoggedIn } = useApp();
  const navigate = useNavigate();

  
  if (!isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-12 border border-gray-100 max-w-md">
          <h2 className="text-3xl font-serif mb-4">Brak dostępu</h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
            Wymagane uprawnienia administratora
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-primary text-white rounded-none px-8"
          >
            Powrót
          </Button>
        </div>
      </div>
    );
  }

  const pendingPayments = bookings.filter((b) => b.status === 'pending');
  const paidBookings = bookings.filter((b) => b.status === 'paid' || b.status === 'confirmed');
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleApprovePayment = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
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
            <span className="text-xs uppercase tracking-widest">Wróć do serwisu</span>
          </Button>
          <h1 className="text-5xl font-serif mb-2">Zarządzanie Hotelem</h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
            Panel administracyjny systemu Luks
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Rezerwacje', value: bookings.length },
            { label: 'Oczekujące', value: pendingPayments.length, color: 'text-accent' },
            { label: 'Zatwierdzone', value: paidBookings.length },
            { label: 'Przychód', value: `${totalRevenue} zł`, color: 'text-accent' }
          ].map((stat, i) => (
            <div key={i} className="border-l border-gray-200 pl-6 py-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
              <p className={`text-3xl font-serif ${stat.color || 'text-primary'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-serif">Oczekujące płatności</h2>
            <span className="text-[10px] uppercase tracking-widest text-accent">
              Wymagają weryfikacji manualnej
            </span>
          </div>

          {pendingPayments.length > 0 ? (
            <div className="bg-white border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Gość</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Pokój</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Termin</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Kwota</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                      <TableCell className="text-[10px] font-mono text-gray-400">#{booking.id.slice(-6)}</TableCell>
                      <TableCell className="font-medium">{booking.userName}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{booking.roomName}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{booking.checkIn} — {booking.checkOut}</TableCell>
                      <TableCell className="text-right font-serif font-bold">{booking.totalPrice} zł</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleApprovePayment(booking.id)}
                            className="p-2 hover:text-accent transition-colors"
                            title="Zatwierdź"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button 
                            className="p-2 hover:text-destructive transition-colors"
                            title="Odrzuć"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-gray-200">
              <p className="font-serif italic text-gray-400">Brak oczekujących operacji</p>
            </div>
          )}
        </div>

        {}
        <div>
          <h2 className="text-2xl font-serif mb-8 border-b border-gray-100 pb-4">Historia rezerwacji</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Gość</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Pokój</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Kwota</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-b border-gray-50">
                    <TableCell className="py-4 font-medium">{booking.userName}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{booking.roomName}</TableCell>
                    <TableCell className="font-serif">{booking.totalPrice} zł</TableCell>
                    <TableCell className="text-right">
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${
                        booking.status === 'paid' || booking.status === 'confirmed' 
                        ? 'text-green-600' 
                        : 'text-accent'
                      }`}>
                        {booking.status === 'paid' ? 'Opłacono' : booking.status === 'confirmed' ? 'Potwierdzono' : 'Oczekuje'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};