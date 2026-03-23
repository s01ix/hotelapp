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
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#1e3a8a]" />
            Data przyjazdu
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="border-gray-300"
          />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#1e3a8a]" />
            Data wyjazdu
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className="border-gray-300"
          />
        </div>

        {/* Number of Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#1e3a8a]" />
            Liczba gosci
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="border-gray-300"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white h-10 font-semibold"
          >
            <Search className="h-4 w-4 mr-2" />
            Szukaj
          </Button>
        </div>
      </div>
    </div>
  );
};