import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CreditCard, Building2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useApp } from '../context/AppContext';
import { BookingDTO, createBooking, createPayment, RoomDTO } from '../components/service/api';

export const Checkout: React.FC = () => {
  const { t } = useTranslation(); 
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, user } = useApp();

  const room = location.state?.room as RoomDTO | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  if (!room || !searchParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center p-12 border border-border max-w-md bg-card">
          <h2 className="text-3xl font-serif mb-4">{t('checkout.sessionExpired')}</h2>
          <p className="text-muted-foreground mb-8 uppercase tracking-widest text-xs">{t('checkout.noBookingDetails')}</p>
          <Button onClick={() => navigate('/')} className="bg-primary text-primary-foreground rounded-none px-8">
            {t('checkout.backToHome')}
          </Button>
        </div>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(searchParams.checkOut).getTime() - 
     new Date(searchParams.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.basePrice * nights;

  const placeholderImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1080";

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const bookingData: BookingDTO = {
        roomId: room.id,
        userId: user!.id,
        checkInDate: searchParams.checkIn,
        checkOutDate: searchParams.checkOut,
        adults: searchParams.guests,
        children: 0,
        notes: `${t('checkout.form.phone')}: ${phone}. ${t('checkout.payment.method')}: ${paymentMethod}`,
      };

      const createdBooking = await createBooking(bookingData);

      if (paymentMethod === 'online') {
        const paymentData = {
          bookingId: createdBooking.id,
          amount: createdBooking.totalAmount || totalPrice,
          currency: 'PLN',
          method: 'paypal',
          status: 'OCZEKUJACA'
        };
        const payment = await createPayment(paymentData);
        window.location.href = `http://localhost:8080/paypal/pay?paymentId=${payment.id}`;
        return; 
      } else {
        alert(t('checkout.alerts.offlineSuccess'));
      }    
      navigate('/dashboard');
      
    } catch (err) {
      setError(t('checkout.alerts.errorSaving'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-8 hover:text-accent p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-xs uppercase tracking-widest text-gray-500">{t('common.back')}</span>
        </Button>
        
        <h1 className="text-5xl font-serif mb-12">{t('checkout.title')}</h1>

        <form onSubmit={handleConfirmBooking}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              
              <section>
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-2">{t('checkout.room.selected')}</h2>
                <div className="flex gap-8 items-start">
                  <img
                    src={placeholderImage}
                    alt={room.name}
                    className="w-40 h-40 object-cover rounded-xl"
                  />
                  <div>
                    <h3 className="text-2xl font-serif mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">{room.description}</p>
                    <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-widest text-gray-400">
                      <span>{t('checkout.room.maxGuests', { count: room.maxGuests })}</span>
                      <span>{t('checkout.room.beds', { count: room.bedCount })}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-2">{t('checkout.form.guestDetails')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-gray-500">{t('checkout.form.fullName')}</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-none border-gray-300 focus-visible:ring-accent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-gray-500">{t('checkout.form.email')}</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-none border-gray-300 focus-visible:ring-accent"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-gray-500">{t('checkout.form.phone')}</Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 000 000 000"
                    className="rounded-none border-gray-300 focus-visible:ring-accent"
                    required
                  />
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-2">{t('checkout.payment.title')}</h2>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'online' | 'offline')}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div
                    className={`p-6 border cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-primary bg-secondary'
                        : 'border-border hover:border-border bg-card'
                    }`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <RadioGroupItem value="online" id="online" />
                      <CreditCard className="h-4 w-4 text-primary" />
                      <Label htmlFor="online" className="font-serif text-lg cursor-pointer">{t('checkout.payment.onlineTitle')}</Label>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider">
                      {t('checkout.payment.onlineDesc')}
                    </p>
                  </div>

                  <div
                    className={`p-6 border cursor-pointer transition-all ${
                      paymentMethod === 'offline'
                        ? 'border-primary bg-gray-50'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                    onClick={() => setPaymentMethod('offline')}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <RadioGroupItem value="offline" id="offline" />
                      <Building2 className="h-4 w-4 text-primary" />
                      <Label htmlFor="offline" className="font-serif text-lg cursor-pointer">{t('checkout.payment.offlineTitle')}</Label>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider">
                      {t('checkout.payment.offlineDesc')}
                    </p>
                  </div>
                </RadioGroup>

                {paymentMethod === 'offline' && (
                  <div className="mt-6 p-6 border border-border bg-card">
                    <p className="text-[10px] uppercase tracking-widest text-accent mb-4 font-bold">{t('checkout.payment.transferDetails')}</p>
                    <div className="space-y-1 text-sm text-gray-600 font-mono">
                      <p>Nr: 88 1020 4444 0000 1234 5678 9000</p>
                      <p>Luks Search</p>
                      <p>{t('checkout.payment.transferTitle', { roomName: room.name.slice(0, 10), fullName })}</p>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="border border-border p-8 sticky top-24 bg-card">
                <h3 className="text-xl font-serif mb-8 border-b border-gray-100 pb-4">{t('checkout.summary.title')}</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">{t('checkout.summary.stay')}</span>
                    {/* i18next automatycznie obsłuży liczby mnogie dla klucza checkout.summary.nights */}
                    <span className="text-sm font-medium">{t('checkout.summary.nights', { count: nights })}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{t('checkout.summary.checkIn')}</span>
                      <span>{searchParams.checkIn}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">{t('checkout.summary.checkOut')}</span>
                      <span>{searchParams.checkOut}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-end mb-8">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400">{t('checkout.summary.total')}</span>
                      <span className="text-3xl font-serif text-primary">{totalPrice} {t('common.currency')}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 border border-red-200 text-sm">
                      <strong>{t('common.error')}: </strong> {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-none py-8 text-sm uppercase tracking-widest transition-colors"
                  >
                    {loading ? t('common.loading') : t('checkout.summary.confirmBtn')}
                  </Button>

                  <p className="text-[9px] text-gray-400 text-center uppercase tracking-tighter leading-relaxed">
                    {t('checkout.summary.termsAcceptance')}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};