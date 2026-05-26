import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { useApp } from '../context/AppContext';

export const Homepage: React.FC = () => {
  
  const { searchParams, rooms, isLoading, error } = useApp();

  const scrollToRooms = () => {
    const roomsSection = document.getElementById('rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const requiredGuests = searchParams?.guests || 1; 

  return (
    <div className="min-h-screen bg-white">
      {}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-serif font-light leading-tight mb-6">
                Odkryj <span className="italic text-accent">nowy wymiar</span> odpoczynku
              </h1>
              <p className="text-xl text-gray-500 mb-10 max-w-md">
                Nowoczesny Hotel w centrum miasta
              </p>
              <SearchBar onSearch={scrollToRooms} />
            </div>
            <div className="hidden lg:block relative h-[600px]">
              <img 
                src="https://images.unsplash.com/photo-1734356972273-f19d4eac8c7c?q=80&w=1080" 
                alt="Lobby"
                className="w-full h-full object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {}
      <div id="rooms-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100">
        <div className="mb-16">
          <h2 className="text-4xl font-serif mb-4">Nasze Apartamenty</h2>
          <p className="text-gray-400">
            {searchParams 
              ? `Wyniki wyszukiwania dla ${requiredGuests} ${requiredGuests === 1 ? 'osoby' : 'osób'}` 
              : 'Starannie zaprojektowane wnętrza dla najbardziej wymagających'}
          </p>
        </div>

        {/* 1. Stan ładowania danych */}
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 animate-pulse">Ładowanie dostępnych pokoi z serwera...</p>
          </div>
        )}

        {/* 2. Stan błędu (np. nieodpalony Spring Boot) */}
        {error && (
          <div className="text-center py-20">
            <p className="text-xl text-red-500">Błąd połączenia z serwerem: {error}</p>
          </div>
        )}

        {/* 3. Wyświetlanie wyników z bazy */}
        {!isLoading && !error && searchParams && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        {/* 4. Brak wyników w wybranym terminie */}
        {!isLoading && !error && searchParams && rooms.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <p className="font-serif text-2xl mb-2 text-primary">Brak apartamentów spełniających kryteria</p>
            <p className="text-gray-500">Niestety nie posiadamy wolnych pokoi dla {requiredGuests} osób w tym terminie. Zmień daty wyszukiwania.</p>
          </div>
        )}

        {/* 5. Stan początkowy (przed kliknięciem "Szukaj") */}
        {!isLoading && !error && !searchParams && (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <p className="font-serif text-2xl mb-2 text-gray-400">Oczekujemy na Twoje zapytanie</p>
            <p className="text-gray-500">Skorzystaj z wyszukiwarki na górze strony.</p>
          </div>
        )}
      </div>
    </div>
  );
};