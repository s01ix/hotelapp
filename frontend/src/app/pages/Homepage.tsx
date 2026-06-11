import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { useApp } from '../context/AppContext';
import { fetchAllHotels, HotelDTO } from '../components/service/api'; 

const HOTEL_IMAGES: Record<number, string> = {
  1: "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1080", 
  2: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1080", 
  3: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1080", 
  4: "https://images.unsplash.com/photo-1614957004131-9e8f2a13123c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  5: "https://images.unsplash.com/photo-1561409037-c7be81613c1f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
};
const DEFAULT_HOTEL_IMAGE = "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1080";

export const Homepage: React.FC = () => {
  const { searchParams, rooms, isLoading, error } = useApp();
  
  const [hotels, setHotels] = useState<HotelDTO[]>([]);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await fetchAllHotels();
        setHotels(data);
      } catch (err) {
        console.error("Błąd ładowania hoteli:", err);
      } finally {
        setIsHotelsLoading(false);
      }
    };
    loadHotels();
  }, []);

  const scrollToRooms = () => {
    const roomsSection = document.getElementById('rooms-section');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const requiredGuests = searchParams?.guests || 1; 

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sekcja Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-serif font-light leading-tight mb-6">
                Odkryj <span className="italic text-accent">nowy wymiar</span> odpoczynku
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-md">
                Najlepsze hotele i apartamenty w całej Polsce. Od górskich szczytów, po bałtyckie plaże.
              </p>
              <SearchBar onSearch={scrollToRooms} />
            </div>
            <div className="hidden lg:block relative h-[600px]">
              <img 
                src="https://images.unsplash.com/photo-1734356972273-f19d4eac8c7c?q=80&w=1080" 
                alt="Lobby Luks Search"
                className="w-full h-full object-cover shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sekcja Wyników / Hoteli */}
      <div id="rooms-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        
        <div className="mb-16">
          <h2 className="text-4xl font-serif mb-4 text-foreground">
            {searchParams ? 'Nasze Apartamenty' : 'Polecane w Luks Search'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchParams 
              ? `Wyniki wyszukiwania dla ${requiredGuests} ${requiredGuests === 1 ? 'osoby' : 'osób'}` 
              : 'Wybierz lokalizację idealną na Twój kolejny wyjazd'}
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400 animate-pulse">Szukanie idealnych pokoi...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-2xl transition-colors duration-300">
            <p className="text-xl text-red-500 dark:text-red-400 font-medium">Błąd połączenia z serwerem: {error}</p>
          </div>
        )}

        {/* Widok: Wyszukane pokoje */}
        {!isLoading && !error && searchParams && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} hotels={hotels} />
            ))}
          </div>
        )}

        {/* Widok: Brak pokoi */}
        {!isLoading && !error && searchParams && rooms.length === 0 && (
          <div className="text-center py-24 bg-secondary rounded-2xl border border-border transition-colors duration-300">
            <h3 className="font-serif text-3xl mb-3 text-foreground">Brak apartamentów spełniających kryteria</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Niestety nie posiadamy wolnych pokoi dla {requiredGuests} osób w tym terminie. Zmień daty wyszukiwania.</p>
          </div>
        )}

        {/* Widok domyślny: Lista Hoteli */}
        {!isLoading && !error && !searchParams && (
          <div>
            {isHotelsLoading ? (
               <div className="text-center py-20 text-gray-500 dark:text-gray-400 animate-pulse text-lg">Wczytywanie bazy najlepszych hoteli...</div>
            ) : hotels.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {hotels.map((hotel) => {
                    const hotelName = hotel.name || (hotel as any).name || 'Luksusowy Hotel Luks Search';
                    const hotelStars = hotel.stars || 4;

                    return (
                      <div key={hotel.id} className="group flex flex-col bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden">
                        {/* ZDJĘCIE Z NAZWĄ */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-black">
                          <img 
                            src={HOTEL_IMAGES[hotel.id] || DEFAULT_HOTEL_IMAGE} 
                            alt={hotelName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90"></div>
                          
                          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-yellow-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest shadow-sm">
                              {'★'.repeat(hotelStars)}
                          </div>

                          <div className="absolute bottom-5 left-6 right-6">
                            <h3 className="text-3xl font-serif text-white drop-shadow-md leading-tight">
                              {hotelName}
                            </h3>
                          </div>
                        </div>
                        
                        {/* MINIMALISTYCZNY KONTAKT */}
                        <div className="px-6 py-5 flex justify-center items-center">
                           <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                              <span className="p-1.5 bg-gray-50 dark:bg-black rounded-md transition-colors">📧</span>
                              {hotel.email}
                           </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
            ) : (
               <div className="text-center py-20 border border-border rounded-2xl transition-colors duration-300">
                 <p className="font-serif text-2xl mb-2 text-gray-400 dark:text-gray-500">Brak hoteli do wyświetlenia</p>
                 <p className="text-gray-500 dark:text-gray-400">Upewnij się, że dodałeś dane do bazy Oracle.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};