import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Users, Building, MapPin, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useApp } from '../context/AppContext';

export const AdminPanel: React.FC = () => {
  const { user, isLoggedIn } = useApp();
  const navigate = useNavigate();

  
if (!isLoggedIn || (user?.role !== 'ADMIN' && user?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-12 border border-gray-100 max-w-md">
          <h2 className="text-3xl font-serif mb-4">Brak dostępu</h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
            Wymagane uprawnienia administratora
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-primary text-white rounded-none px-8"
          >
            Powrót
          </Button>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      title: 'Zarządzanie Użytkownikami',
      description: 'Zmieniaj role użytkowników (np. na Recepcjonistę).',
      icon: <Users className="h-8 w-8 text-primary mb-4" />,
      path: '/admin/users' 
    },
    {
      title: 'Zarządzanie Pokojami',
      description: 'Dodawaj nowe pokoje, edytuj zdjęcia, pojemność i opisy.',
      icon: <Building className="h-8 w-8 text-primary mb-4" />,
      path: '/admin/rooms'
    },
    {
      title: 'Ceny i Udogodnienia',
      description: 'Konfiguruj cenniki, dodawaj WiFi, TV, śniadania itp.',
      icon: <DollarSign className="h-8 w-8 text-primary mb-4" />,
      path: '/admin/amenities'
    },
    {
      title: 'Lokalizacje',
      description: 'Zarządzaj budynkami i adresami Twoich obiektów.',
      icon: <MapPin className="h-8 w-8 text-primary mb-4" />,
      path: '/admin/locations'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NAGŁÓWEK */}
        <div className="mb-16">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 hover:text-accent p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-xs uppercase tracking-widest">Wróć do serwisu</span>
          </Button>
          <h1 className="text-5xl font-serif mb-2">Panel Administratora</h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">
            Konfiguracja główna systemu Luks
          </p>
        </div>

        {/* KAFELKI MODUŁÓW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminModules.map((mod, i) => (
            <div 
              key={i} 
              onClick={() => navigate(mod.path)}
              className="border border-gray-100 p-8 hover:border-accent hover:shadow-sm transition-all cursor-pointer bg-white group"
            >
              <div className="group-hover:scale-105 transition-transform origin-left">
                {mod.icon}
              </div>
              <h3 className="text-xl font-serif mb-2">{mod.title}</h3>
              <p className="text-gray-500 text-sm">{mod.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};