import React from 'react';
import { useNavigate } from 'react-router';
import { Users, Maximize } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Room } from '../data/mockData';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Room Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {room.pricePerNight} zl / noc
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{room.description}</p>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Do {room.maxGuests} osob</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{room.size}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-[#1e3a8a] text-xs rounded-md"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{room.amenities.length - 3} wiecej
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => navigate(`/room/${room.id}`)}
          className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
        >
          Zobacz szczegoly
        </Button>
      </CardFooter>
    </Card>
  );
};