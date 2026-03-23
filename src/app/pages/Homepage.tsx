import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { rooms } from '../data/mockData';

export const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* dolny panel napisow */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(30, 58, 138, 0.6), rgba(30, 58, 138, 0.6)), url(https://images.unsplash.com/photo-1734356972273-f19d4eac8c7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5JTIwZW50cmFuY2V8ZW58MXx8fHwxNzc0Mjc5NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080)',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Witamy w Naszym Hotelu
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Luksusowe pokoje w samym centrum miasta
            </p>
          </div>
          
          {/* wyszukiwarka */}
          <SearchBar />
        </div>
      </div>

      {/* Panel dostepnych pokojow*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dostepne pokoje
          </h2>
          <p className="text-gray-600">
            Wybierz cos dla siebie z naszej szerokiej oferty
          </p>
        </div>

        {/* Karty pokojowe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* Funkcje */}
      <div className="bg-[#1e3a8a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl"></div>
              <h3 className="text-xl font-semibold">Najlepsza Obsluga</h3>
              <p className="text-blue-100">
                Doceniani za wyjatkowa goscinnosc i zadowolenie klientow
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl"></div>
              <h3 className="text-xl font-semibold">Swietna Lokalizacja</h3>
              <p className="text-blue-100">
                Znajdujemy sie w centrum miasta blisko najwiekszych atrakcji
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl"></div>
              <h3 className="text-xl font-semibold">Luksusowe Udogodnienia</h3>
              <p className="text-blue-100">
                Najwyzszy standard uslug dla Twojego niezapomnianego pobytu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};