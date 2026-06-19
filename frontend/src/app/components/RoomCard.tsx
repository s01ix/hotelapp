import React from 'react';
import { useNavigate } from 'react-router';
import { Users, BedDouble, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { RoomDTO, HotelDTO } from './service/api';
import { useTranslation } from 'react-i18next'; 

interface RoomCardProps {
  room: RoomDTO;
  hotels?: HotelDTO[];
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, hotels = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const fallbackImage = "http://localhost:8080/uploads/Noimage.jpg";
  const primaryPhoto = room.photos?.find(p => p.isPrimary);
  const currentImage = primaryPhoto?.url || (room.photos && room.photos.length > 0 ? room.photos[0].url : fallbackImage);

  const formatBeds = (count: number) => {
    if (count === 1) return `1 ${t('roomCard.bed_one')}`;
    if (count >= 2 && count <= 4) return `${count} ${t('roomCard.bed_few')}`;
    return `${count} ${t('roomCard.bed_many')}`;
  };

  const formatGuests = (count: number) => {
    if (count === 1) return `Max 1 ${t('roomCard.guest_one')}`;
    if (count >= 2 && count <= 4) return `Max ${count} ${t('roomCard.guest_few')}`;
    return `Max ${count} ${t('roomCard.guest_many')}`;
  };

  const descriptionParts = room.description ? room.description.split('Udogodnienia:') : [t('roomCard.noDescription')];
  const mainDescription = descriptionParts[0];
  const amenitiesList = descriptionParts.length > 1 ? descriptionParts[1].split(',') : [];

  let hotelName = t('roomCard.unknownHotel');
  if (room.hotelId && hotels && hotels.length > 0) {
      hotelName = hotels.find(h => h.id === room.hotelId)?.name || t('roomCard.unknownHotel');
  }
  if (hotelName === t('roomCard.unknownHotel')) {
      const fallbackNames = ['Gorski Resort & Spa', 'Morska Bryza', 'City Center Premium', 'Lesna Ostoja', 'Mazurski Raj'];
      const hotelIndex = room.id ? Math.floor((room.id - 1) / 5) % fallbackNames.length : 0;
      hotelName = fallbackNames[hotelIndex];
  }

  return (
    <div className="group cursor-pointer flex flex-col h-full bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden" onClick={() => navigate(`/room/${room.id}`)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img src={currentImage} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold tracking-widest text-accent flex items-center gap-1 shadow-sm">
          <MapPin className="h-3 w-3" />
          {hotelName}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-semibold shadow-lg">
            {t('roomCard.checkAndBook')}
          </Button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div>
          <h3 className="text-2xl font-serif group-hover:text-accent transition-colors mb-2 line-clamp-1" title={room.name}>
            {room.name}
          </h3>
          <div className="flex justify-between items-end border-b border-gray-100 pb-4">
            <div className="flex flex-col gap-1.5 text-xs tracking-widest uppercase text-gray-500 font-medium">
              <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-gray-400" /> {formatGuests(room.maxGuests)}</span>
              <span className="flex items-center gap-2"><BedDouble className="h-3.5 w-3.5 text-gray-400" /> {formatBeds(room.bedCount)}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400 block mb-1">{t('roomCard.pricePerNight')}</span>
              <span className="text-3xl font-light text-gray-900">{room.basePrice} <span className="text-lg font-medium">{t('roomCard.currency')}</span></span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {mainDescription}
        </p>

        {amenitiesList.length > 0 && (
          <div className="mt-auto pt-4 flex flex-wrap gap-2">
            {amenitiesList.map((amenity, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-secondary text-muted-foreground px-2.5 py-1 rounded-md text-xs font-medium border border-border">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                {amenity.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};