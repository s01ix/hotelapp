import React from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Users, DollarSign, ArrowLeft } from 'lucide-react';
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

export const UserDashboard: React.FC = () => {
  const { user, bookings, isLoggedIn } = useApp();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Zaloguj sie, aby wyswietlic swoje rezerwacje
          </h2>
          <Button onClick={() => navigate('/')} className="bg-[#1e3a8a]">
            Powrot do strony glownej
          </Button>
        </div>
      </div>
    );
  }

  // Filtrowanie rezerwacji zalogowanego uzytkownika
  const userBookings = bookings.filter((b) => b.userId === user?.id);
  
  const upcomingBookings = userBookings.filter(
    (b) => new Date(b.checkIn) >= new Date()
  );
  
  const pastBookings = userBookings.filter(
    (b) => new Date(b.checkIn) < new Date()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Opłacone</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Oczekuje na zatwierdzenie</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-500">Potwierdzone</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
          <h1 className="text-3xl font-bold text-gray-900">Moje Rezerwacje</h1>
          <p className="text-gray-600 mt-2">
            Witaj  {user?.name}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Wszystkie rezerwacje</p>
                  <p className="text-3xl font-bold text-[#1e3a8a]">
                    {userBookings.length}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nadchodzace pobyty</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {upcomingBookings.length}
                  </p>
                </div>
                <Users className="h-10 w-10 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Suma wydatkow</p>
                  <p className="text-3xl font-bold text-green-600">
                    {userBookings.reduce((sum, b) => sum + b.totalPrice, 0)} zl
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <Card className="mb-8 overflow-hidden">
            <CardHeader className="bg-[#1e3a8a] text-white">
              <CardTitle className="text-lg">Nadchodzace rezerwacje</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pokoj</TableHead>
                      <TableHead>Przyjazd</TableHead>
                      <TableHead>Wyjazd</TableHead>
                      <TableHead>Goscie</TableHead>
                      <TableHead>Cena</TableHead>
                      <TableHead>Platnosc</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium text-xs">#{booking.id.slice(0,8)}</TableCell>
                        <TableCell>{booking.roomName}</TableCell>
                        <TableCell>{booking.checkIn}</TableCell>
                        <TableCell>{booking.checkOut}</TableCell>
                        <TableCell>{booking.guests}</TableCell>
                        <TableCell className="font-semibold">
                          {booking.totalPrice} zl
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {booking.paymentMethod === 'online' ? 'Online' : 'Przelew'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-lg text-gray-700">Historia pobytow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pokoj</TableHead>
                      <TableHead>Przyjazd</TableHead>
                      <TableHead>Wyjazd</TableHead>
                      <TableHead>Cena</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastBookings.map((booking) => (
                      <TableRow key={booking.id} className="opacity-70">
                        <TableCell className="text-xs">#{booking.id.slice(0,8)}</TableCell>
                        <TableCell>{booking.roomName}</TableCell>
                        <TableCell>{booking.checkIn}</TableCell>
                        <TableCell>{booking.checkOut}</TableCell>
                        <TableCell>{booking.totalPrice} zl</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Bookings Case */}
        {userBookings.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Brak rezerwacji
              </h3>
              <p className="text-gray-600 mb-6">
                Nie masz jeszcze zadnych rezerwacji. Znajdz idealny pokoj dla siebie!
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Przegladaj pokoje
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};