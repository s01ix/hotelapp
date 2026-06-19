import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import { SearchBar } from '../components/SearchBar';
import { RoomCard } from '../components/RoomCard';
import { useApp } from '../context/AppContext';
import { fetchAllHotels, HotelDTO } from '../components/service/api'; 

const HOTEL_IMAGES: Record<number, string> = {
  1: "http://localhost:8080/uploads/hotel1.jpg", 
  2: "http://localhost:8080/uploads/hotel2.jpg", 
  3: "http://localhost:8080/uploads/hotel3.jpg", 
  4: "http://localhost:8080/uploads/hotel4.jpg", 
  5: "http://localhost:8080/uploads/hotel5.jpg",};
const DEFAULT_HOTEL_IMAGE = "http://localhost:8080/uploads/Noimage.jpg";

export const Homepage: React.FC = () => {
  const { t } = useTranslation(); 
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
                {t('home.hero.discover')} <span className="italic text-accent">{t('home.hero.newDimension')}</span> {t('home.hero.rest')}
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-md">
                {t('home.hero.subtitle')}
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
            {searchParams ? t('home.results.title') : t('home.results.recommendedTitle')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchParams 
              ? t('home.results.searchSubtitle', { count: requiredGuests }) 
              : t('home.results.recommendedSubtitle')}
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400 animate-pulse">{t('home.states.loadingRooms')}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-2xl transition-colors duration-300">
            <p className="text-xl text-red-500 dark:text-red-400 font-medium">{t('home.states.error', { error })}</p>
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
            <h3 className="font-serif text-3xl mb-3 text-foreground">{t('home.states.noRoomsTitle')}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('home.states.noRoomsDesc', { count: requiredGuests })}</p>
          </div>
        )}

        {/* Widok domyślny: Lista Hoteli */}
        {!isLoading && !error && !searchParams && (
          <div>
            {isHotelsLoading ? (
               <div className="text-center py-20 text-gray-500 dark:text-gray-400 animate-pulse text-lg">{t('home.states.loadingHotels')}</div>
            ) : hotels.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {hotels.map((hotel) => {
                    const hotelName = hotel.name || (hotel as any).name || t('home.hotel.defaultName');
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
                 <p className="font-serif text-2xl mb-2 text-gray-400 dark:text-gray-500">{t('home.states.noHotelsTitle')}</p>
                 <p className="text-gray-500 dark:text-gray-400">{t('home.states.noHotelsDesc')}</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};