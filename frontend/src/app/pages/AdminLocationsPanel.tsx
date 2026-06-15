import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Edit, Trash, MapPin, Star, Building } from 'lucide-react';
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
import { useTranslation } from 'react-i18next';

export const AdminLocationsPanel: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [hotelsList, setHotelsList] = useState<HotelDTO[]>([]);
  const [locationsList, setLocationsList] = useState<LocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);

  const [hotelFormData, setHotelFormData] = useState<Partial<HotelDTO>>({
    name: '', description: '', stars: 3, email: '', phone: ''
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
    loadData();
  }, []);

  const handleOpenDialog = (hotel?: HotelDTO) => {
    if (hotel) {
      setEditingHotelId(hotel.id);
      setHotelFormData({ ...hotel });
      
      const location = locationsList.find(l => l.id === hotel.locationId);
      if (location) {
        setEditingLocationId(location.id);
        setLocationFormData({ ...location });
      }
    } else {
      setEditingHotelId(null);
      setEditingLocationId(null);
      setHotelFormData({
        name: '', description: '', stars: 3, email: '', phone: ''
      });
      setLocationFormData({
        street: '', buildingNumber: '', city: '', postalCode: '', country: 'Polska'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      let locationId: number;

      if (editingLocationId) {
        await updateLocation(editingLocationId, locationFormData as LocationDTO);
        locationId = editingLocationId;
      } else {
        const newLocation = await createLocation(locationFormData as LocationDTO);
        locationId = newLocation.id;
      }

      const hotelData = { ...hotelFormData, locationId };
      
      if (editingHotelId) {
        await updateHotel(editingHotelId, hotelData as HotelDTO);
      } else {
        await createHotel(hotelData as HotelDTO);
      }
      
      setIsDialogOpen(false);
      await loadData();
    } catch (err) {
      alert(t('adminLocations.errors.save'));
      console.error(err);
    }
  };

  const handleDelete = async (hotel: HotelDTO) => {
    if (window.confirm(t('adminLocations.prompts.deleteHotel', { name: hotel.name }))) {
      try {
        await deleteHotel(hotel.id);
        
        if (hotel.locationId) {
          const isLocationUsedByOthers = hotelsList.some(
            h => h.id !== hotel.id && h.locationId === hotel.locationId
          );
          
          if (!isLocationUsedByOthers) {
            try {
              await deleteLocation(hotel.locationId);
            } catch (err) {
              console.error(t('adminLocations.errors.deleteLocation'), err);
            }
          }
        }
        
        await loadData();
      } catch (err) {
        alert(t('adminLocations.errors.delete'));
      }
    }
  };

  const handleHotelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setHotelFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocationFormData(prev => ({ ...prev, [name]: value }));
  };

  const getLocationString = (locationId?: number) => {
    const loc = locationsList.find(l => l.id === locationId);
    if (!loc) return t('adminLocations.noAddress');
    return `${loc.city}, ul. ${loc.street} ${loc.buildingNumber}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" className="mb-6 -ml-4" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('adminLocations.backToPanel')}
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-serif text-primary">{t('adminLocations.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('adminLocations.subtitle')}</p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/50">
            <h2 className="font-medium text-foreground">{t('adminLocations.listTitle')}</h2>
            <Button onClick={() => handleOpenDialog()} className="bg-primary text-primary-foreground h-9">
              <Plus className="mr-2 h-4 w-4" /> {t('adminLocations.addHotel')}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('adminLocations.table.nameAndAddress')}</TableHead>
                <TableHead>{t('adminLocations.table.contact')}</TableHead>
                <TableHead>{t('adminLocations.table.stars')}</TableHead>
                <TableHead className="text-right">{t('adminLocations.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">{t('adminLocations.loading')}</TableCell></TableRow>
              ) : hotelsList.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">{t('adminLocations.noHotels')}</TableCell></TableRow>
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
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(hotel)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(hotel)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHotelId ? t('adminLocations.dialog.editTitle') : t('adminLocations.dialog.addTitle')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b pb-2">
                <Building className="h-4 w-4" />
                <span>{t('adminLocations.dialog.hotelData')}</span>
              </div>
              
              <div className="space-y-2">
                <Label>{t('adminLocations.dialog.hotelName')}</Label>
                <Input name="name" value={hotelFormData.name} onChange={handleHotelChange} placeholder={t('adminLocations.dialog.placeholders.name')} />
              </div>
              
              <div className="space-y-2">
                <Label>{t('adminLocations.dialog.description')}</Label>
                <Textarea name="description" value={hotelFormData.description} onChange={handleHotelChange} rows={3} placeholder={t('adminLocations.dialog.placeholders.description')} />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t('adminLocations.dialog.email')}</Label>
                  <Input name="email" type="email" value={hotelFormData.email} onChange={handleHotelChange} placeholder={t('adminLocations.dialog.placeholders.email')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('adminLocations.dialog.phone')}</Label>
                  <Input name="phone" value={hotelFormData.phone} onChange={handleHotelChange} placeholder={t('adminLocations.dialog.placeholders.phone')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('adminLocations.dialog.stars')}</Label>
                  <Input name="stars" type="number" min="1" max="5" value={hotelFormData.stars} onChange={handleHotelChange} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b pb-2">
                <MapPin className="h-4 w-4" />
                <span>{t('adminLocations.dialog.locationData')}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>{t('adminLocations.dialog.street')}</Label>
                  <Input name="street" value={locationFormData.street} onChange={handleLocationChange} placeholder={t('adminLocations.dialog.placeholders.street')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('adminLocations.dialog.buildingNumber')}</Label>
                  <Input name="buildingNumber" value={locationFormData.buildingNumber} onChange={handleLocationChange} placeholder={t('adminLocations.dialog.placeholders.buildingNumber')} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('adminLocations.dialog.city')}</Label>
                  <Input name="city" value={locationFormData.city} onChange={handleLocationChange} placeholder={t('adminLocations.dialog.placeholders.city')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('adminLocations.dialog.postalCode')}</Label>
                  <Input name="postalCode" value={locationFormData.postalCode} onChange={handleLocationChange} placeholder={t('adminLocations.dialog.placeholders.postalCode')} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t('adminLocations.dialog.country')}</Label>
                <Input name="country" value={locationFormData.country} onChange={handleLocationChange} placeholder={t('adminLocations.dialog.placeholders.country')} />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('adminLocations.dialog.cancel')}</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">{t('adminLocations.dialog.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};