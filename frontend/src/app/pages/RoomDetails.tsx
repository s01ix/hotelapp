import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Users, BedDouble, Check, Star, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';
import { RoomDTO, fetchRoomById, fetchRoomOpinions, Opinion } from '../components/service/api';
import { toast } from 'sonner';

export const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { searchParams, isLoggedIn } = useApp();
  
  const [room, setRoom] = useState<RoomDTO | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [displayedOpinions, setDisplayedOpinions] = useState<Opinion[]>([]);
  const [showAllOpinions, setShowAllOpinions] = useState(false);
  const [opinionsLoading, setOpinionsLoading] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1080";
  const primaryPhoto = room?.photos?.find(p => p.isPrimary);
  const currentImage = primaryPhoto?.url || (room?.photos && room.photos.length > 0 ? room.photos[0].url : fallbackImage);

  useEffect(() => {
    const loadRoom = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await fetchRoomById(parseInt(id));
        setRoom(data);
      } catch (error) {
        setError('Nie można załadować szczegółów pokoju');
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [id]);

  useEffect(() => {
    const loadOpinions = async () => {
      if (!id) return;
      try {
        setOpinionsLoading(true);
        const data = await fetchRoomOpinions(parseInt(id));
        
        const sorted = data.sort((a, b) => b.rate - a.rate);
        setOpinions(sorted);
        
        setDisplayedOpinions(sorted.slice(0, 3));
      } catch (error) {
        console.error('Błąd ładowania opinii:', error);
      } finally {
        setOpinionsLoading(false);
      }
    };
    loadOpinions();
  }, [id]);

  const toggleShowAllOpinions = () => {
    if (showAllOpinions) {
      setDisplayedOpinions(opinions.slice(0, 3));
    } else {
      setDisplayedOpinions(opinions);
    }
    setShowAllOpinions(!showAllOpinions);
  };

  const averageRating = opinions.length > 0
    ? (opinions.reduce((sum, op) => sum + op.rate, 0) / opinions.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground animate-pulse">Ładowanie szczegółów pokoju...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center bg-card p-8 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">Nie znaleziono pokoju</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/')}>Wróć do strony głównej</Button>
        </div>
      </div>
    );
  }

const handleBookNow = () => {
    if (!isLoggedIn) {
      toast.error('Aby zarezerwować pokój, musisz się zalogować');

      navigate('/dashboard');

      return;
    }

    if (!searchParams) {
      toast.error('Wybierz daty przyjazdu i wyjazdu');
      navigate('/');
      return;
    }

    navigate('/checkout', { state: { room } });
  };

  const getNights = () => {
    if (!searchParams) return 0;
    const checkInDate = new Date(searchParams.checkIn);
    const checkOutDate = new Date(searchParams.checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const nights = getNights();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Wróć do listy pokoi
        </Button>

        {/* Room Image */}
        <div className="relative h-96 rounded-xl overflow-hidden mb-8">
          <img
            src={currentImage}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          
          {/* Średnia ocena na zdjęciu */}
          {averageRating && (
            <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-lg">{averageRating}</span>
              <span className="text-sm text-gray-600">({opinions.length})</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{room.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-lg text-gray-500 font-medium">Nr {room.roomNumber}</span>
                
                {/* Gwiazdki z oceną */}
                {averageRating && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(parseFloat(averageRating))
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {averageRating} ({opinions.length} {opinions.length === 1 ? 'opinia' : 'opinii'})
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-lg text-gray-600">{room.description}</p>
            </div>

            {/* Room Info */}
            <div className="flex items-center gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#1e3a8a]" />
                <span>Do {room.maxGuests} osób</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-[#1e3a8a]" />
                <span>{room.bedCount} łóżka</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Udogodnienia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenityName, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 capitalize">{amenityName}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Brak informacji o udogodnieniach</p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-[#1e3a8a] mb-2">Ważne informacje</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Zameldowanie: 15:00 | Wymeldowanie: 11:00</li>
                <li>• Polityka anulowania: Darmowe anulowanie do 48h przed przyjazdem</li>
                <li>• Zwierzęta nie są akceptowane</li>
                <li>• Zakaz palenia we wszystkich pokojach</li>
              </ul>
            </div>

            {/* SEKCJA OPINII */}
            {opinions.length > 0 && (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-[#1e3a8a]" />
                  Opinie gości ({opinions.length})
                </h2>

                {opinionsLoading ? (
                  <p className="text-gray-500 italic">Ładowanie opinii...</p>
                ) : (
                  <div className="space-y-6">
                    {displayedOpinions.map((opinion) => (
                      <div
                        key={opinion.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        {/* Nagłówek opinii */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {opinion.userName || 'Gość'}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {opinion.createdAt
                                  ? new Date(opinion.createdAt).toLocaleDateString('pl-PL', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })
                                  : ''}
                              </span>
                            </div>
                            
                            {/* Gwiazdki */}
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= opinion.rate
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Komentarz */}
                        {opinion.comment && (
                          <p className="text-gray-700 leading-relaxed mt-3">
                            "{opinion.comment}"
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Przycisk "Pokaż więcej" / "Pokaż mniej" */}
                    {opinions.length > 5 && (
                      <div className="text-center pt-4">
                        <Button
                          onClick={toggleShowAllOpinions}
                          variant="outline"
                          className="px-8"
                        >
                          {showAllOpinions
                            ? 'Pokaż mniej opinii'
                            : `Pokaż wszystkie opinie (${opinions.length})`}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Brak opinii */}
            {opinions.length === 0 && !opinionsLoading && (
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Brak opinii
                  </h3>
                  <p className="text-gray-500">
                    Ten pokój nie ma jeszcze żadnych opinii. Bądź pierwszy!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#1e3a8a] mb-1">
                  {room.basePrice} zł
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
                    <span className="text-gray-600">Goście:</span>
                    <span className="font-medium">{searchParams.guests}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Suma:</span>
                      <span className="font-bold text-[#1e3a8a]">
                        {room.basePrice * nights} zł
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
                  Wybierz daty na stronie głównej, aby zobaczyć cenę całkowitą
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};