import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CreditCard, Building2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useApp } from '../context/AppContext';
import { BookingDTO, createBooking, createPayment, RoomDTO } from '../components/service/api';


export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, user, isLoggedIn } = useApp();

  const room = location.state?.room as RoomDTO | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  if (!room || !searchParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-12 border border-gray-100 max-w-md">
          <h2 className="text-3xl font-serif mb-4">Sesja wygasła</h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">Nie znaleziono szczegółów rezerwacji</p>
          <Button onClick={() => navigate('/')} className="bg-primary text-white rounded-none px-8">
            Wróć do strony głównej
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
    
    if (!user || !user.id) {
      setError('Musisz być zalogowany, aby dokonać rezerwacji.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

    const bookingData: BookingDTO = {
        roomId: room.id,
        userId: user.id,
        checkInDate: searchParams.checkIn,
        checkOutDate: searchParams.checkOut,
        adults: searchParams.guests,
        children: 0,
        notes: `Telefon: ${phone}. Metoda płatności: ${paymentMethod}`,
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
        return; // Zatrzymaj nawigacje, przejście do PayPala
      } else {
        alert('Rezerwacja złożona! Prosimy o dokonanie przelewu.');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas zapisu rezerwacji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-8 hover:text-accent p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-xs uppercase tracking-widest text-gray-500">Powrót</span>
        </Button>
        
        <h1 className="text-5xl font-serif mb-12">Rezerwacja</h1>

        <form onSubmit={handleConfirmBooking}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              
              <section>
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-2">Wybrany apartament</h2>
                <div className="flex gap-8 items-start">
                  <img
                    src={placeholderImage}
                    alt={room.name}
                    className="w-40 h-40 object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-serif mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">{room.description}</p>
                    <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-widest text-gray-400">
                      <span>Max. {room.maxGuests} osób</span>
                      <span>{room.bedCount} łóżka</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-2">Dane gościa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-gray-500">Imię i Nazwisko</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-none border-gray-300 focus-visible:ring-accent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-gray-500">Adres E-mail</Label>
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
                  <Label className="text-xs uppercase tracking-widest text-gray-500">Numer telefonu</Label>
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
                <h2 className="text-xl font-serif mb-6 border-b border-gray-100 pb-2">Metoda płatności</h2>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'online' | 'offline')}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div
                    className={`p-6 border cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-primary bg-gray-50'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <RadioGroupItem value="online" id="online" />
                      <CreditCard className="h-4 w-4 text-primary" />
                      <Label htmlFor="online" className="font-serif text-lg cursor-pointer">Online</Label>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider">
                      Natychmiastowe potwierdzenie rezerwacji (Karta / BLIK)
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
                      <Label htmlFor="offline" className="font-serif text-lg cursor-pointer">Przelew</Label>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider">
                      Wymaga weryfikacji przez obsługę hotelu
                    </p>
                  </div>
                </RadioGroup>

                {paymentMethod === 'offline' && (
                  <div className="mt-6 p-6 border border-gray-100 bg-white">
                    <p className="text-[10px] uppercase tracking-widest text-accent mb-4 font-bold">Dane do przelewu</p>
                    <div className="space-y-1 text-sm text-gray-600 font-mono">
                      <p>Nr: 88 1020 4444 0000 1234 5678 9000</p>
                      <p>Hotel Luks & Spa Sp. z o.o.</p>
                      <p>Tytuł: Rezerwacja {room.name.slice(0, 10)} - {fullName}</p>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="border border-gray-200 p-8 sticky top-24 bg-white">
                <h3 className="text-xl font-serif mb-8 border-b border-gray-100 pb-4">Podsumowanie</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400">Pobyt</span>
                    <span className="text-sm font-medium">{nights} {nights === 1 ? 'noc' : 'noce'}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Zameldowanie</span>
                      <span>{searchParams.checkIn}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Wymeldowanie</span>
                      <span>{searchParams.checkOut}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-end mb-8">
                      <span className="text-[10px] uppercase tracking-widest text-gray-400">Suma brutto</span>
                      <span className="text-3xl font-serif text-primary">{totalPrice} zł</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 border border-red-200 text-sm">
                      <strong>Błąd: </strong> {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-accent text-white rounded-none py-8 text-sm uppercase tracking-widest transition-colors"
                  >
                    Potwierdzam rezerwację
                  </Button>

                  <p className="text-[9px] text-gray-400 text-center uppercase tracking-tighter leading-relaxed">
                    Dokonując rezerwacji akceptujesz regulamin świadczenia usług Hotelu Luks & Spa
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