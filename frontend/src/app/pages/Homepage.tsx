import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { useApp } from '../context/AppContext';
import { fetchAllRooms, fetchAllHotels, RoomDTO, HotelDTO } from '../components/service/api';

const HOTEL_IMAGES: Record<number, string> = {
  1: "http://localhost:8080/uploads/hotel1.jpg", 
  2: "http://localhost:8080/uploads/hotel2.jpg", 
  3: "http://localhost:8080/uploads/hotel3.jpg", 
  4: "http://localhost:8080/uploads/hotel4.jpg", 
  5: "http://localhost:8080/uploads/hotel5.jpg", 
};
const DEFAULT_HOTEL_IMAGE = "http://localhost:8080/uploads/placeholder.jfif";

export const Homepage: React.FC = () => {
  const { searchParams, rooms: searchResults, isLoading: isSearchLoading, error: searchError } = useApp();
  
  const [hotels, setHotels] = useState<HotelDTO[]>([]);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);
  const [isDefaultLoading, setIsDefaultLoading] = useState(true);
  const [defaultRooms, setDefaultRooms] = useState<RoomDTO[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [hotelsData, roomsData] = await Promise.all([fetchAllHotels(), fetchAllRooms()]);
        setHotels(hotelsData);
        setDefaultRooms(roomsData);
      } catch (err) {
        console.error("Błąd ładowania danych", err);
      } finally {
        setIsHotelsLoading(false);
        setIsDefaultLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const scrollToRooms = () => {
    const roomsSection = document.getElementById('rooms-section');
    if (roomsSection) roomsSection.scrollIntoView({ behavior: 'smooth' });
  };

  const displayRooms = searchParams ? searchResults : defaultRooms;
  const currentLoading = searchParams ? isSearchLoading : isDefaultLoading;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-serif font-light leading-tight mb-6">
                Odkryj <span className="italic text-accent">nowy wymiar</span> odpoczynku
              </h1>
              <SearchBar onSearch={scrollToRooms} />
            </div>
            <div className="hidden lg:block relative h-[600px]">
              <img src="http://localhost:8080/uploads/lobby.jfif" className="w-full h-full object-cover shadow-2xl rounded-2xl" alt="Lobby" />
            </div>
          </div>
        </div>
      </section>

      {}
      {!searchParams && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-serif mb-12">Nasze Hotele</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <img 
                  src={HOTEL_IMAGES[hotel.id] || DEFAULT_HOTEL_IMAGE} 
                  className="w-full h-48 object-cover" 
                  alt={hotel.name || "Hotel"} 
                />
                <div className="p-6">
                  {}
                  <h3 className="text-xl font-bold">
                    {(hotel as any).name || (hotel as any).nazwa || "Hotel bez nazwy"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {(hotel as any).description || (hotel as any).opis || "Brak opisu"}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Kontakt: {(hotel as any).email || "Brak danych"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      <div id="rooms-section" className="max-w-7xl mx-auto px-4 py-24 border-t">
        <h2 className="text-4xl font-serif mb-16">{searchParams ? "Wyniki wyszukiwania" : "Nasze Apartamenty"}</h2>
        
        {currentLoading ? <p>Ładowanie...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {displayRooms.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
        )}
      </div>
    </div>
  );
};