import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, X, LogOut } from 'lucide-react';
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

export const ReceptionistPanel: React.FC = () => {
  const { bookings, updateBookingStatus} = useApp();
  const navigate = useNavigate();

  const pendingPayments = bookings.filter((b) => b.status === 'OCZEKUJACA');

  const activeBookings = bookings.filter((b) => b.status === 'POTWIERDZONA');

  const historyBookings = bookings.filter((b) => b.status === 'ZAKONCZONA' || b.status === 'ANULOWANA');
  
  const totalRevenue = [...activeBookings, ...historyBookings]
    .filter(b => b.status !== 'ANULOWANA')
    .reduce((sum, b) => sum + b.totalAmount, 0);


  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'POTWIERDZONA': return 'text-green-600';
      case 'ZAKONCZONA': return 'text-gray-500';
      case 'ANULOWANA': return 'text-red-600';
      case 'OCZEKUJACA': return 'text-accent';
      default: return 'text-gray-400';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'POTWIERDZONA': return 'Potwierdzona';
      case 'ZAKONCZONA': return 'Zakończona';
      case 'ANULOWANA': return 'Anulowana';
      case 'OCZEKUJACA': return 'Oczekuje';
      default: return status; 
    }
  };

  const handleApprovePayment = (bookingId: number) => {
    updateBookingStatus(bookingId, 'POTWIERDZONA');
  };

  const handleCancelPayment = (bookingId: number) => {
    updateBookingStatus(bookingId, 'ANULOWANA');
  };

  const handleFinishBooking = (bookingId: number) => {
    updateBookingStatus(bookingId, 'ZAKONCZONA');
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 hover:text-accent p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-xs uppercase tracking-widest">Wróć do serwisu</span>
          </Button>
          <h1 className="text-5xl font-serif mb-2">Panel Recepcji</h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
            Obsługa gości i rezerwacji na żywo
          </p>
        </div>

        {/*Statystyki*/}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Oczekujące płatności', value: pendingPayments.length, color: 'text-accent' },
            { label: 'Goście w hotelu', value: activeBookings.length, color: 'text-green-600' },
            { label: 'Suma rezerwacji', value: bookings.length },
            { label: 'Przychód', value: `${totalRevenue} zł` }
          ].map((stat, i) => (
            <div key={i} className="border-l border-gray-200 pl-6 py-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
              <p className={`text-3xl font-serif ${stat.color || 'text-primary'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/*Oczekujące płatności*/}
        <div className="mb-16">
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
                      <TableCell className="text-[10px] font-mono text-gray-400">#{booking.id}</TableCell>
                      <TableCell className="font-medium text-sm text-gray-700">{booking.userEmail || 'Brak danych'}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{booking.roomName}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{booking.checkInDate} — {booking.checkOutDate}</TableCell>
                      <TableCell className="text-right font-serif font-bold">{booking.totalAmount} zł</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleApprovePayment(booking.id)} className="p-2 hover:text-green-600 transition-colors" title="Zatwierdź wpłatę">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleCancelPayment(booking.id)} className="p-2 hover:text-red-500 transition-colors" title="Odrzuć rezerwację">
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
            <div className="py-12 text-center border border-dashed border-gray-200">
              <p className="font-serif italic text-gray-400">Brak oczekujących operacji</p>
            </div>
          )}
        </div>

        {/*Aktywne rezerwacje*/}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-serif">Goście w hotelu</h2>
            <span className="text-[10px] uppercase tracking-widest text-green-600">
              Płatność zweryfikowana — gotowi do wymeldowania
            </span>
          </div>

          {activeBookings.length > 0 ? (
            <div className="bg-white border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">ID</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Gość</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Pokój</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Termin</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Akcja</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                      <TableCell className="text-[10px] font-mono text-gray-400">#{booking.id}</TableCell>
                      <TableCell className="font-medium text-sm text-gray-700">{booking.userEmail || 'Brak danych'}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{booking.roomName}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{booking.checkInDate} — {booking.checkOutDate}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => handleFinishBooking(booking.id)}
                          variant="outline"
                          className="border-gray-200 text-xs rounded-none hover:bg-gray-900 hover:text-white h-8"
                        >
                          <LogOut className="h-3 w-3 mr-2" />
                          Wymelduj gościa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-gray-200">
              <p className="font-serif italic text-gray-400">Brak gości przebywających obecnie w hotelu</p>
            </div>
          )}
        </div>

        {/*Historia rezerwacji*/}
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
                {historyBookings.map((booking) => (
                  <TableRow key={booking.id} className="border-b border-gray-50">
                    <TableCell className="font-medium text-sm text-gray-700">{booking.userEmail || 'Brak danych'}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{booking.roomName}</TableCell>
                    <TableCell className="font-serif">{booking.totalAmount} zł</TableCell>
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
        </div>
      </div>
    </div>
  );
};