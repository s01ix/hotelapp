import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { rooms } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const Homepage: React.FC = () => {
  
  const { searchParams } = useApp();

  const scrollToRooms = () => {
    const roomsSection = document.getElementById('rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const requiredGuests = searchParams?.guests || 1;
  
  const filteredRooms = rooms.filter(room => room.maxGuests >= requiredGuests);

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

        {}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <p className="font-serif text-2xl mb-2 text-primary">Brak apartamentów spełniających kryteria</p>
            <p className="text-gray-500">Niestety nie posiadamy pokoi dla {requiredGuests} osób. Zmniejsz liczbę gości, aby zobaczyć dostępne opcje.</p>
          </div>
        )}
      </div>
    </div>
  );
};