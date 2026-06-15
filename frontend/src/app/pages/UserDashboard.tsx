import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 
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
  const { t } = useTranslation();
  const { user, bookings, loginWithGoogle } = useApp();
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

  useEffect(() => {
    const status = searchParams.get('status');
    const error = searchParams.get('error');
    if (status === 'success') {
      setPaymentMessage({ type: 'success', text: t('dashboard.payment.success') });
    } else if (status === 'canceled') {
      setPaymentMessage({ type: 'warning', text: t('dashboard.payment.canceled') });
    } else if (status === 'error' || error) {
      setPaymentMessage({ type: 'error', text: t('dashboard.payment.error') });
    }
  }, [searchParams, t]);

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

  const checkBookingsCanReview = useCallback(async () => {
    if (!user?.id || bookings.length === 0) return;
    
    try {
      const canReviewSet = new Set<number>();
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

  useEffect(() => {
    if (user?.id) {
      loadUserOpinions();
    }
  }, [user?.id, loadUserOpinions]);

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
        text: t('dashboard.opinion.success'),
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
    return t(`dashboard.status.${status}`, { defaultValue: status });
  };
  
  const today = new Date().toISOString().split('T')[0];
  const upcomingBookings = bookings.filter((b) => b.checkInDate >= today);
  const pastBookings = bookings.filter((b) => b.checkOutDate < today);

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
            <span className="text-xs uppercase tracking-widest">{t('common.backToHome')}</span>
          </Button>
          <h1 className="text-5xl font-serif mb-2">{t('dashboard.greeting', { name: user?.name })}</h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
            {t('dashboard.subtitle')}
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
              {t('dashboard.stats.totalBookings')}
            </p>
            <p className="text-3xl font-serif text-primary">{bookings.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              {t('dashboard.stats.upcomingStays')}
            </p>
            <p className="text-3xl font-serif text-accent">{upcomingBookings.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{t('dashboard.stats.yourOpinions')}</p>
            <p className="text-3xl font-serif text-primary">{userOpinions.length}</p>
          </div>
          <div className="border-l border-gray-200 pl-6 py-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{t('dashboard.stats.totalSpent')}</p>
            <p className="text-3xl font-serif text-primary">
              {bookings.reduce((sum, b) => sum + b.totalAmount, 0)} {t('common.currency')}
            </p>
          </div>
        </div>

        {/* Nadchodzące pobyty */}
        <div className="mb-24">
          <h2 className="text-2xl font-serif mb-8 border-b border-gray-100 pb-4">
            {t('dashboard.upcoming.title')}
          </h2>
          {upcomingBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.id')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.apartment')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.dates')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.amount')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">
                      {t('dashboard.table.status')}
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
                        {booking.totalAmount} {t('common.currency')}
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
              <p className="font-serif italic text-gray-400">{t('dashboard.upcoming.empty')}</p>
            </div>
          )}
        </div>

        {/* Historia pobytów Z OPINIAMI */}
        {pastBookings.length > 0 && (
          <div className="mb-24">
            <h2 className="text-2xl font-serif mb-8 border-b border-gray-100 pb-4 text-gray-400">
              {t('dashboard.history.title')}
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.apartment')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.dates')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.amount')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {t('dashboard.table.status')}
                    </TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">
                      {t('dashboard.table.opinion')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map((booking) => {
                    const opinion = userOpinions.find((op) => op.bookingId === booking.id);
                    const canReview = bookingsCanReview.has(booking.id);
                    const roomId = (booking as any).roomId;

                    return (
                      <TableRow key={booking.id} className="border-b border-gray-50">
                        <TableCell className="text-gray-500">{booking.roomName}</TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {booking.checkInDate} — {booking.checkOutDate}
                        </TableCell>
                        <TableCell className="text-gray-500 font-serif">
                          {booking.totalAmount} {t('common.currency')}
                        </TableCell>
                        <TableCell>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            {t('dashboard.status.ZAKONCZONA')}
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
                              {t('dashboard.history.leaveOpinionBtn')}
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
            <h3 className="text-3xl font-serif mb-6">{t('dashboard.empty.title')}</h3>
            <Button
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground rounded-none px-10 py-6 text-sm uppercase tracking-widest hover:bg-accent"
            >
              {t('dashboard.empty.browseBtn')}
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