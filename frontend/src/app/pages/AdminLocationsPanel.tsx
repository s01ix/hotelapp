import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Edit, Trash, MapPin, Star, Building, Map } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { useApp } from '../context/AppContext';
import { 
  HotelDTO, 
  LocationDTO,
  fetchAllHotels, 
  fetchAllLocations,
  createHotel, 
  updateHotel, 
  deleteHotel,
  createLocation,
  updateLocation,
  deleteLocation
} from '../components/service/api';

export const AdminLocationsPanel: React.FC = () => {
  const { user, isLoggedIn } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'hotels' | 'locations'>('hotels');
  
  const [hotelsList, setHotelsList] = useState<HotelDTO[]>([]);
  const [locationsList, setLocationsList] = useState<LocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isHotelDialogOpen, setIsHotelDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [hotelFormData, setHotelFormData] = useState<Partial<HotelDTO>>({
    name: '', description: '', stars: 3, email: '', phone: '', locationId: 0
  });

  const [locationFormData, setLocationFormData] = useState<Partial<LocationDTO>>({
    street: '', buildingNumber: '', city: '', postalCode: '', country: 'Polska'
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [hotelsData, locationsData] = await Promise.all([
        fetchAllHotels(),
        fetchAllLocations()
      ]);
      setHotelsList(hotelsData);
      setLocationsList(locationsData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && (user?.role === 'ADMIN' || user?.role === 'admin')) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn || (user?.role !== 'ADMIN' && user?.role !== 'admin')) {
    return <div className="text-center p-12">Brak dostępu.</div>;
  }

  const handleOpenHotelDialog = (hotel?: HotelDTO) => {
    if (hotel) {
      setEditingId(hotel.id);
      setHotelFormData({ ...hotel });
    } else {
      setEditingId(null);
      setHotelFormData({
        name: '', description: '', stars: 3, email: '', phone: '', 
        locationId: locationsList.length > 0 ? locationsList[0].id : 0
      });
    }
    setIsHotelDialogOpen(true);
  };

  const handleSaveHotel = async () => {
    try {
      if (editingId) await updateHotel(editingId, hotelFormData as HotelDTO);
      else await createHotel(hotelFormData as HotelDTO);
      
      setIsHotelDialogOpen(false);
      await loadData();
    } catch (err) {
      alert("Wystąpił błąd podczas zapisywania hotelu.");
      console.error(err);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    if (window.confirm("Na pewno usunąć ten hotel?")) {
      try {
        await deleteHotel(id);
        await loadData();
      } catch (err) {
        alert("Błąd podczas usuwania hotelu.");
      }
    }
  };

  const handleOpenLocationDialog = (location?: LocationDTO) => {
    if (location) {
      setEditingId(location.id);
      setLocationFormData({ ...location });
    } else {
      setEditingId(null);
      setLocationFormData({ street: '', buildingNumber: '', city: '', postalCode: '', country: 'Polska' });
    }
    setIsLocationDialogOpen(true);
  };

  const handleSaveLocation = async () => {
    try {
      if (editingId) await updateLocation(editingId, locationFormData as LocationDTO);
      else await createLocation(locationFormData as LocationDTO);
      
      setIsLocationDialogOpen(false);
      await loadData();
    } catch (err) {
      alert("Wystąpił błąd podczas zapisywania adresu.");
      console.error(err);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (window.confirm("Na pewno usunąć ten adres? Upewnij się, że nie jest przypisany do żadnego hotelu!")) {
      try {
        await deleteLocation(id);
        await loadData();
      } catch (err) {
        alert("Błąd podczas usuwania adresu. Może być przypisany do hotelu.");
      }
    }
  };

  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number' || name === 'locationId';
    setHotelFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocationFormData(prev => ({ ...prev, [name]: value }));
  };

  const getLocationString = (locationId?: number) => {
    const loc = locationsList.find(l => l.id === locationId);
    if (!loc) return "Brak przypisanego adresu";
    return `${loc.city}, ul. ${loc.street} ${loc.buildingNumber}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" className="mb-6 -ml-4" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Powrót do Panelu
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-serif text-primary">Obiekty i Lokalizacje</h1>
          <p className="text-gray-500 mt-2">Zarządzaj adresami fizycznymi oraz przypisanymi do nich hotelami.</p>
        </div>

        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button 
            className={`pb-4 px-2 font-medium text-sm flex items-center transition-colors ${activeTab === 'hotels' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('hotels')}
          >
            <Building className="w-4 h-4 mr-2" /> Hotele
          </button>
          <button 
            className={`pb-4 px-2 font-medium text-sm flex items-center transition-colors ${activeTab === 'locations' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('locations')}
          >
            <Map className="w-4 h-4 mr-2" /> Adresy (Lokalizacje)
          </button>
        </div>

        {activeTab === 'hotels' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-medium text-gray-700">Lista hoteli</h2>
              <Button onClick={() => handleOpenHotelDialog()} className="bg-primary text-white h-9">
                <Plus className="mr-2 h-4 w-4" /> Dodaj Hotel
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa i Adres</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Gwiazdki</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Ładowanie...</TableCell></TableRow>
                ) : hotelsList.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Brak hoteli.</TableCell></TableRow>
                ) : (
                  hotelsList.map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell>
                        <div className="font-medium text-primary">{hotel.name}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" /> {getLocationString(hotel.locationId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{hotel.email}</div>
                        <div className="text-xs text-gray-500">{hotel.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-yellow-500">
                          {hotel.stars} <Star className="h-3 w-3 ml-1 fill-current" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenHotelDialog(hotel)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteHotel(hotel.id)}><Trash className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-medium text-gray-700">Fizyczne adresy budynków</h2>
              <Button onClick={() => handleOpenLocationDialog()} className="bg-primary text-white h-9">
                <Plus className="mr-2 h-4 w-4" /> Dodaj Adres
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miasto i Kraj</TableHead>
                  <TableHead>Ulica i Numer</TableHead>
                  <TableHead>Kod Pocztowy</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Ładowanie...</TableCell></TableRow>
                ) : locationsList.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Brak adresów.</TableCell></TableRow>
                ) : (
                  locationsList.map((loc) => (
                    <TableRow key={loc.id}>
                      <TableCell>
                        <div className="font-medium">{loc.city}</div>
                        <div className="text-xs text-gray-500">{loc.country}</div>
                      </TableCell>
                      <TableCell>{loc.street} {loc.buildingNumber}</TableCell>
                      <TableCell>{loc.postalCode}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenLocationDialog(loc)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteLocation(loc.id)}><Trash className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isHotelDialogOpen} onOpenChange={setIsHotelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{editingId ? 'Edytuj Hotel' : 'Dodaj Hotel'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nazwa hotelu</Label>
              <Input name="name" value={hotelFormData.name} onChange={handleHotelChange} />
            </div>
            <div className="space-y-2">
              <Label>Adres (Lokalizacja)</Label>
              {locationsList.length === 0 ? (
                <div className="text-sm text-red-500">Musisz najpierw dodać Lokalizację w drugiej zakładce!</div>
              ) : (
                <select 
                  name="locationId" 
                  value={hotelFormData.locationId} 
                  onChange={handleHotelChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value={0} disabled>-- Wybierz adres --</option>
                  {locationsList.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.city}, ul. {loc.street} {loc.buildingNumber}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <Label>Opis</Label>
              <Textarea name="description" value={hotelFormData.description} onChange={handleHotelChange} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input name="email" value={hotelFormData.email} onChange={handleHotelChange} /></div>
              <div className="space-y-2"><Label>Telefon</Label><Input name="phone" value={hotelFormData.phone} onChange={handleHotelChange} /></div>
            </div>
            <div className="space-y-2 w-1/2">
              <Label>Gwiazdki</Label>
              <Input name="stars" type="number" min="1" max="5" value={hotelFormData.stars} onChange={handleHotelChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHotelDialogOpen(false)}>Anuluj</Button>
            <Button onClick={handleSaveHotel} disabled={!hotelFormData.locationId} className="bg-primary text-white">Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>{editingId ? 'Edytuj Adres' : 'Dodaj Adres'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Ulica</Label>
                <Input name="street" value={locationFormData.street} onChange={handleLocationChange} placeholder="np. Marszałkowska" />
              </div>
              <div className="space-y-2">
                <Label>Nr budynku</Label>
                <Input name="buildingNumber" value={locationFormData.buildingNumber} onChange={handleLocationChange} placeholder="12A" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Miasto</Label>
                <Input name="city" value={locationFormData.city} onChange={handleLocationChange} placeholder="Warszawa" />
              </div>
              <div className="space-y-2">
                <Label>Kod pocztowy</Label>
                <Input name="postalCode" value={locationFormData.postalCode} onChange={handleLocationChange} placeholder="00-001" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kraj</Label>
              <Input name="country" value={locationFormData.country} onChange={handleLocationChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>Anuluj</Button>
            <Button onClick={handleSaveLocation} className="bg-primary text-white">Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};