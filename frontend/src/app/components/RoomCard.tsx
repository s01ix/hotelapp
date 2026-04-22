import React from 'react';
import { useNavigate } from 'react-router';
import { Users, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Room } from '../data/mockData';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/room/${room.id}`)}>
      <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gray-100">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="w-full bg-white text-black hover:bg-accent hover:text-white transition-colors">
            Sprawdź dostępność
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-serif group-hover:text-accent transition-colors">{room.name}</h3>
          <span className="text-lg font-medium">{room.pricePerNight} zł</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-gray-400">
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {room.maxGuests} Os.</span>
          <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" /> {room.size}</span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 pt-2 border-t border-gray-100">
          {room.description}
        </p>
      </div>
    </div>
  );
};