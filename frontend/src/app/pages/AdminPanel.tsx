import React from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, ArrowLeft, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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

  // Sprawdzanie uprawnien
  if (!isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Brak dostepu</h2>
          <p className="text-gray-600 mb-6">Nie masz uprawnien administratora do wyswietlenia tej strony.</p>
          <Button onClick={() => navigate('/')} className="bg-[#1e3a8a]">
            Powrot na strone glowna
          </Button>
        </div>
      </div>
    );
  }

  // Logika filtrowania rezerwacji
  const pendingPayments = bookings.filter((b) => b.status === 'pending');
  const paidBookings = bookings.filter((b) => b.status === 'paid' || b.status === 'confirmed');
  
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleApprovePayment = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    alert(`Platnosc dla rezerwacji ${bookingId} zostala zatwierdzona!`);
  };

  const handleRejectPayment = (bookingId: string) => {
    if (confirm('Czy na pewno chcesz odrzucic te platnosc?')) {
      alert(`Platnosc dla rezerwacji ${bookingId} zostala odrzucona.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Wroc do strony glownej
          </Button>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 text-[#1e3a8a]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel Administratora</h1>
              <p className="text-gray-600 mt-1">Zarzadzaj platnosciami i rezerwacjami gosci</p>
            </div>
          </div>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Wszystkie rezerwacje</p>
                  <p className="text-3xl font-bold text-[#1e3a8a]">{bookings.length}</p>
                </div>
                <ShieldCheck className="h-10 w-10 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Oczekujace wplaty</p>
                  <p className="text-3xl font-bold text-amber-600">{pendingPayments.length}</p>
                </div>
                <XCircle className="h-10 w-10 text-amber-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Zatwierdzone</p>
                  <p className="text-3xl font-bold text-green-600">{paidBookings.length}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Calkowity przychod</p>
                  <p className="text-3xl font-bold text-emerald-600">{totalRevenue} zl</p>
                </div>
                <DollarSign className="h-10 w-10 text-emerald-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sekcja: Oczekujace na zatwierdzenie */}
        <Card className="mb-8 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5" />
              Oczekujace platnosci przelewem (Offline)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Gosc</TableHead>
                      <TableHead>Pokoj</TableHead>
                      <TableHead>Przyjazd</TableHead>
                      <TableHead>Wyjazd</TableHead>
                      <TableHead>Kwota</TableHead>
                      <TableHead>Metoda</TableHead>
                      <TableHead>Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((booking) => (
                      <TableRow key={booking.id} className="bg-amber-50/50">
                        <TableCell className="font-medium text-xs">#{booking.id.slice(0,8)}</TableCell>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{booking.roomName}</TableCell>
                        <TableCell>{booking.checkIn}</TableCell>
                        <TableCell>{booking.checkOut}</TableCell>
                        <TableCell className="font-bold">{booking.totalPrice} zl</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-white">
                            {booking.paymentMethod === 'online' ? 'Online' : 'Przelew'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApprovePayment(booking.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Zatwierdz
                            </Button>
                            <Button
                              onClick={() => handleRejectPayment(booking.id)}
                              size="sm"
                              variant="destructive"
                            >
                              Odrzuc
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Wszystko gotowe!</h3>
                <p className="text-gray-600">Brak oczekujacych wplat do zatwierdzenia.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sekcja: Wszystkie rezerwacje */}
        <Card>
          <CardHeader className="bg-[#1e3a8a] text-white rounded-t-lg">
            <CardTitle className="text-lg">Historia wszystkich rezerwacji</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Gosc</TableHead>
                    <TableHead>Pokoj</TableHead>
                    <TableHead>Przyjazd</TableHead>
                    <TableHead>Wyjazd</TableHead>
                    <TableHead>Kwota</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="text-xs text-gray-500">#{booking.id.slice(0,8)}</TableCell>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>{booking.roomName}</TableCell>
                      <TableCell>{booking.checkIn}</TableCell>
                      <TableCell>{booking.checkOut}</TableCell>
                      <TableCell className="font-semibold">{booking.totalPrice} zl</TableCell>
                      <TableCell>
                        {booking.status === 'paid' && (
                          <Badge className="bg-green-500">Zaplacono</Badge>
                        )}
                        {booking.status === 'pending' && (
                          <Badge className="bg-amber-500">Oczekuje</Badge>
                        )}
                        {booking.status === 'confirmed' && (
                          <Badge className="bg-blue-500">Potwierdzono</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};