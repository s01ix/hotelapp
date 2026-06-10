import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
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
import { OpinionModal } from '../components/OpinionModal';
import { 
  fetchUserOpinions, 
  canReviewBooking, 
  createOpinion,
  Opinion,
  OpinionFormData 
} from '../components/service/api';

export const UserDashboard: React.FC = () => {
  const { user, bookings, loginWithGoogle} = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [paymentMessage, setPaymentMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);
  
  const [userOpinions, setUserOpinions] = useState<Opinion[]>([]);
  const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    id: number;
    roomId: number;
    roomName: string;
  } | null>(null);
  const [bookingsCanReview, setBookingsCanReview] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Obsługa komunikatów z PayPal
  useEffect(() => {
    const status = searchParams.get('status');
    const error = searchParams.get('error');
    if (status === 'success') {
      setPaymentMessage({ type: 'success', text: 'Płatność PayPal zakończona pomyślnie!' });
    } else if (status === 'canceled') {
      setPaymentMessage({ type: 'warning', text: 'Płatność PayPal została anulowana.' });
    } else if (status === 'error' || error) {
      setPaymentMessage({ type: 'error', text: 'Wystąpił błąd podczas płatności PayPal.' });
    }
  }, [searchParams]);

  // Funkcja ładowania opinii użytkownika
  const loadUserOpinions = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const opinions = await fetchUserOpinions(user.id);
      setUserOpinions(opinions);
    } catch (error) {
      console.error('Błąd podczas pobierania opinii:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Funkcja sprawdzania możliwości wystawienia opinii
  const checkBookingsCanReview = useCallback(async () => {
    if (!user?.id || bookings.length === 0) return;
    
    try {
      const canReviewSet = new Set<number>();
      
      // Sprawdzaj tylko zakończone rezerwacje
      const today = new Date().toISOString().split('T')[0];
      const pastBookings = bookings.filter((b) => b.checkOutDate < today);
      
      for (const booking of pastBookings) {
        try {
          const canReview = await canReviewBooking(booking.id, user.id);
          if (canReview) {
            canReviewSet.add(booking.id);
          }
        } catch (error) {
          console.error(`Błąd sprawdzania rezerwacji ${booking.id}:`, error);
        }
      }
      
      setBookingsCanReview(canReviewSet);
    } catch (error) {
      console.error('Błąd podczas sprawdzania rezerwacji:', error);
    }
  }, [user?.id, bookings]);

  // Pobieranie opinii użytkownika przy załadowaniu
  useEffect(() => {
    if (user?.id) {
      loadUserOpinions();
    }
  }, [user?.id, loadUserOpinions]);

  // Sprawdzanie  możliwości wystawienia opinii
  useEffect(() => {
    if (user?.id && bookings.length > 0) {
      checkBookingsCanReview();
    }
  }, [user?.id, bookings.length, checkBookingsCanReview]);

  const handleAddOpinion = (booking: { id: number; roomId: number; roomName: string }) => {
    setSelectedBooking(booking);
    setIsOpinionModalOpen(true);
  };

  const handleOpinionSubmit = async (data: OpinionFormData) => {
    if (!user?.id) return;
    
    try {
      await createOpinion(user.id, data);
      setIsOpinionModalOpen(false);
      setSelectedBooking(null);
      await loadUserOpinions();
      await checkBookingsCanReview();
      
      setPaymentMessage({
        type: 'success',
        text: 'Dziękujemy za wystawienie opinii!',
      });
      
      setTimeout(() => setPaymentMessage(null), 5000);
    } catch (error) {
      console.error('Błąd podczas dodawania opinii:', error);
      throw error;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'OPLACONA':
      case 'POTWIERDZONA':
      case 'ZAKONCZONA':
        return 'text-green-600';
      case 'OCZEKUJACA':
        return 'text-blue-600';
      case 'ANULOWANA':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'OPLACONA':
      case 'POTWIERDZONA':
        return 'Potwierdzone';
      case 'OCZEKUJACA':
        return 'Oczekuje';
      case 'ANULOWANA':
        return 'Anulowane';
      case 'ZAKONCZONA':
        return 'Zakończone';
      default:
        return status;
    }
  };
  
  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter((b) => b.checkInDate >= today);
  const pastBookings = bookings.filter((b) => b.checkOutDate < today);

  return (
    <div className="min-h-screen bg-[#fdfdfd] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Twoja historia i planowane pobyty
          </p>
        </div>

        {paymentMessage && (
          <div
            className={`mb-8 p-4 border ${
              paymentMessage.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : paymentMessage.type === 'warning'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {paymentMessage.text}
          </div>
        )}

        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              Wszystkie rezerwacje
            </p>
            <p className="text-3xl font-serif text-primary">{bookings.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              Nadchodzące pobyty
            </p>
            <p className="text-3xl font-serif text-accent">{upcomingBookings.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Twoje opinie</p>
            <p className="text-3xl font-serif text-primary">{userOpinions.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Suma wydatków</p>
            <p className="text-3xl font-serif text-primary">
              {bookings.reduce((sum, b) => sum + b.totalAmount, 0)} zł
            </p>
          </div>
        </div>

        {/* Nadchodzące pobyty */}
        <div className="mb-24">
          <h2 className="text-2xl font-serif mb-8 border-b border-gray-100 pb-4">
            Nadchodzące pobyty
          </h2>
          {upcomingBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      ID
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Apartament
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Termin
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Kwota
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.map((booking) => (
                    <TableRow key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/30">
                      <TableCell className="text-[10px] font-mono text-gray-400">
                        #{booking.id}
                      </TableCell>
                      <TableCell className="font-medium">{booking.roomName}</TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {booking.checkInDate} — {booking.checkOutDate}
                      </TableCell>
                      <TableCell className="font-serif font-bold text-primary">
                        {booking.totalAmount} zł
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`text-[10px] uppercase tracking-widest font-bold ${getStatusStyle(
                            booking.status
                          )}`}
                        >
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

        {/* Historia pobytów Z OPINIAMI */}
        {pastBookings.length > 0 && (
          <div className="mb-24">
            <h2 className="text-2xl font-serif mb-8 border-b border-gray-100 pb-4 text-gray-400">
              Historia pobytów
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Apartament
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Termin
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Kwota
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Status
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">
                      Opinia
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map((booking) => {
                    const opinion = userOpinions.find((op) => op.bookingId === booking.id);
                    const canReview = bookingsCanReview.has(booking.id);
                    const roomId = (booking as any).roomId; // Fallback jeśli roomId nie jest w typie

                    return (
                      <TableRow key={booking.id} className="border-b border-gray-50">
                        <TableCell className="text-gray-500">{booking.roomName}</TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {booking.checkInDate} — {booking.checkOutDate}
                        </TableCell>
                        <TableCell className="text-gray-500 font-serif">
                          {booking.totalAmount} zł
                        </TableCell>
                        <TableCell>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Zakończono
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {opinion ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < opinion.rate
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {opinion.comment && (
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          ) : canReview && roomId ? (
                            <Button
                              onClick={() =>
                                handleAddOpinion({
                                  id: booking.id,
                                  roomId: roomId,
                                  roomName: booking.roomName,
                                })
                              }
                              variant="outline"
                              size="sm"
                              className="text-xs uppercase tracking-widest"
                            >
                              Wystaw opinię
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* No Bookings Case */}
        {bookings.length === 0 && (
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

      {/* Modal opinii */}
      {selectedBooking && (
        <OpinionModal
          isOpen={isOpinionModalOpen}
          bookingId={selectedBooking.id}
          roomId={selectedBooking.roomId}
          roomName={selectedBooking.roomName}
          onSubmit={handleOpinionSubmit}
          onClose={() => {
            setIsOpinionModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};