import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Users, Maximize, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { rooms } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { searchParams, isLoggedIn } = useApp();
  
  const room = rooms.find((r) => r.id === id);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nie znaleziono pokoju</h2>
          <Button onClick={() => navigate('/')}>Wroc do strony glownej</Button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isLoggedIn) {
      alert('Zaloguj sie, aby dokonac rezerwacji');
      return;
    }
    if (!searchParams) {
      alert('Wybierz daty przyjazdu i wyjazdu na stronie glownej');
      navigate('/');
      return;
    }
    navigate('/checkout', { state: { room } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Wroc do listy pokoi
        </Button>

        {/* Room Image */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{room.name}</h1>
              <p className="text-lg text-gray-600">{room.description}</p>
            </div>

            {/* Room Info */}
            <div className="flex items-center gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#1e3a8a]" />
                <span>Do {room.maxGuests} osob</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-[#1e3a8a]" />
                <span>{room.size}</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Udogodnienia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#1e3a8a] mb-2">Wazne informacje</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Zameldowanie: 15:00 | Wymeldowanie: 11:00</li>
                <li>• Polityka anulowania: Darmowe anulowanie do 48h przed przyjazdem</li>
                <li>• Zwierzeta nie sa akceptowane</li>
                <li>• Zakaz palenia we wszystkich pokojach</li>
              </ul>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#1e3a8a] mb-1">
                  {room.pricePerNight} zl
                </div>
                <div className="text-gray-600">za noc</div>
              </div>

              {searchParams && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Przyjazd:</span>
                    <span className="font-medium">{searchParams.checkIn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Wyjazd:</span>
                    <span className="font-medium">{searchParams.checkOut}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Goscie:</span>
                    <span className="font-medium">{searchParams.guests}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Suma:</span>
                      <span className="font-bold text-[#1e3a8a]">
                        {room.pricePerNight * Math.ceil(
                            (new Date(searchParams.checkOut).getTime() - 
                             new Date(searchParams.checkIn).getTime()) / 
                            (1000 * 60 * 60 * 24)
                          )} zl
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleBookNow}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6"
              >
                Zarezerwuj teraz
              </Button>

              {!searchParams && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  Wybierz daty na stronie glownej, aby zobaczyc cene calkowita
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};