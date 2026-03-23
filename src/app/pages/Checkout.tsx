import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CreditCard, Building2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { Room } from '../data/mockData';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchParams, user, addBooking } = useApp();
  const room = location.state?.room as Room | undefined;

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  if (!room || !searchParams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sesja wygasła</h2>
          <p className="text-gray-600 mb-6">Nie znaleziono szczegółów rezerwacji.</p>
          <Button onClick={() => navigate('/')} className="bg-[#1e3a8a]">Wróć do strony głównej</Button>
        </div>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(searchParams.checkOut).getTime() - 
     new Date(searchParams.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.pricePerNight * nights;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBooking = {
      id: `BK${Date.now()}`,
      userId: user?.id || 'guest',
      roomId: room.id,
      roomName: room.name,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: searchParams.guests,
      totalPrice,
      // Logika statusu: online -> opłacone, offline -> oczekujące
      status: paymentMethod === 'online' ? ('paid' as const) : ('pending' as const),
      paymentMethod,
      userName: fullName,
    };

    addBooking(newBooking);
    
    if (paymentMethod === 'online') {
      alert('Płatność zakończona sukcesem! Rezerwacja została potwierdzona.');
    } else {
      alert('Rezerwacja złożona! Prosimy o dokonanie przelewu. Rezerwacja zostanie zatwierdzona przez administratora po zaksięgowaniu wpłaty.');
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 hover:bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powrót
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Podsumowanie i Płatność</h1>

        <form onSubmit={handleConfirmBooking}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lewa kolumna: Dane i Płatność */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Szczegóły pokoju */}
              <Card>
                <CardHeader>
                  <CardTitle>Wybrany Pokój</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dane gościa */}
              <Card>
                <CardHeader>
                  <CardTitle>Dane Gościa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Imię i Nazwisko *</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Adres E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numer Telefonu *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+48 000 000 000"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Wybór płatności */}
              <Card>
                <CardHeader>
                  <CardTitle>Metoda Płatności</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as 'online' | 'offline')}
                    className="space-y-4"
                  >
                    {/* Płatność Online */}
                    <div
                      className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'online'
                          ? 'border-[#1e3a8a] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('online')}
                    >
                      <RadioGroupItem value="online" id="online" className="mt-1" />
                      <label htmlFor="online" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-5 w-5 text-[#1e3a8a]" />
                          <span className="font-semibold text-gray-900">
                            Płatność Online (Karta / BLIK)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Natychmiastowe potwierdzenie rezerwacji przez system szybkich płatności.
                        </p>
                      </label>
                    </div>

                    {/* Przelew Tradycyjny */}
                    <div
                      className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'offline'
                          ? 'border-[#1e3a8a] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('offline')}
                    >
                      <RadioGroupItem value="offline" id="offline" className="mt-1" />
                      <label htmlFor="offline" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-5 w-5 text-[#1e3a8a]" />
                          <span className="font-semibold text-gray-900">
                            Przelew Tradycyjny
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Zarezerwuj teraz, zapłać przelewem w ciągu 24h. Rezerwacja zostanie zatwierdzona przez obsługę hotelu.
                        </p>
                        {paymentMethod === 'offline' && (
                          <div className="mt-4 bg-amber-50 rounded-md p-3 border border-amber-200">
                            <p className="text-sm font-medium text-amber-900 mb-1">Dane do przelewu:</p>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              Nr konta: 88 1020 4444 0000 1234 5678 9000<br />
                              Odbiorca: Hotel React Resort Sp. z o.o.<br />
                              Tytuł: Rezerwacja {room.name} - {fullName}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Prawa kolumna: Podsumowanie kosztów */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="bg-[#1e3a8a] text-white rounded-t-lg">
                  <CardTitle>Podsumowanie kosztów</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Przyjazd:</span>
                      <span className="font-medium">{searchParams.checkIn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Wyjazd:</span>
                      <span className="font-medium">{searchParams.checkOut}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {room.pricePerNight} zł × {nights} noce
                      </span>
                      <span className="font-medium">{totalPrice} zł</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Opłata serwisowa</span>
                      <span className="font-medium">0 zł</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-lg">Suma:</span>
                        <span className="font-bold text-2xl text-[#1e3a8a]">
                          {totalPrice} zł
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Potwierdzam rezerwację
                  </Button>

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Klikając przycisk, akceptujesz regulamin hotelu oraz politykę prywatności.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};