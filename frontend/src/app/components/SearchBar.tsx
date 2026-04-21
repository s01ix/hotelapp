import React, { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  onSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { setSearchParams } = useApp();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (checkIn && checkOut) {
      setSearchParams({
        checkIn,
        checkOut,
        guests,
      });
      if (onSearch) {
        onSearch();
      }
    } else {
      alert('Proszę wybrać daty przyjazdu i wyjazdu przed rozpoczęciem wyszukiwania.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 w-full shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Check-in Date */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Data przyjazd
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border-gray-300 rounded-none focus-visible:ring-accent block"
          />
        </div>

        {}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Data wyjazdu
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className="w-full border-gray-300 rounded-none focus-visible:ring-accent block"
          />
        </div>

        {/* Number of Guests */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Liczba gości
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full border-gray-300 rounded-none focus-visible:ring-accent block"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="w-full bg-primary hover:bg-accent text-white h-10 font-medium rounded-none transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            Szukaj
          </Button>
        </div>
      </div>
    </div>
  );
};