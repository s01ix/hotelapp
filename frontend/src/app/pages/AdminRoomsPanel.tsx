import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Edit, Trash, Bed, Users } from 'lucide-react';
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
import { RoomDTO, HotelDTO, fetchAllRooms, createRoom, updateRoom, deleteRoom, fetchAllHotels, createRoomPhoto, deleteRoomPhoto } from '../components/service/api';

export const AdminRoomsPanel: React.FC = () => {
  const { user, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const [roomsList, setRoomsList] = useState<RoomDTO[]>([]);
  const [hotelsList, setHotelsList] = useState<HotelDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isPhotoPrimary, setIsPhotoPrimary] = useState(false);

  const [formData, setFormData] = useState<Partial<RoomDTO>>({
    roomNumber: '',
    name: '',
    description: '',
    bedCount: 1,
    maxGuests: 1,
    basePrice: 0,
    currency: 'PLN',
    status: 'DOSTEPNY',
    hotelId: 1 
  });

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const [roomsData, hotelsData] = await Promise.all([
        fetchAllRooms(),
        fetchAllHotels()
      ]);
      setRoomsList(roomsData);
      setHotelsList(hotelsData);
      
      if (hotelsData.length > 0 && formData.hotelId === 1) {
          setFormData(prev => ({...prev, hotelId: hotelsData[0].id}));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && (user?.role === 'ADMIN' || user?.role === 'admin')) {
      loadRooms();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn || (user?.role !== 'ADMIN' && user?.role !== 'admin')) {
    return <div className="text-center p-12">Brak dostępu.</div>;
  }

  const handleOpenDialog = (room?: RoomDTO) => {
    if (room) {
      setEditingRoomId(room.id);
      setFormData({
        ...room,
      });
    } else {
      setEditingRoomId(null);
      setFormData({
        roomNumber: '',
        name: '',
        description: '',
        bedCount: 1,
        maxGuests: 1,
        basePrice: 0,
        currency: 'PLN',
        status: 'DOSTEPNY',
        hotelId: hotelsList.length > 0 ? hotelsList[0].id : 1
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRoomId(null);
    setNewPhotoUrl('');
    setIsPhotoPrimary(false);
  };

  const handleAddPhoto = async () => {
    if(!editingRoomId || !newPhotoUrl.trim()) return;
    try {
      await createRoomPhoto({
        roomId: editingRoomId,
        url: newPhotoUrl,
        isPrimary: isPhotoPrimary
      });
      setNewPhotoUrl('');
      setIsPhotoPrimary(false);
      await loadRooms();
      
      const updatedRooms = await fetchAllRooms();
      const updatedRoom = updatedRooms.find(r => r.id === editingRoomId);
      if(updatedRoom) {
          setFormData(prev => ({...prev, photos: updatedRoom.photos}));
      }
      setRoomsList(updatedRooms);
    } catch(err) {
      alert("Błąd podczas dodawania zdjęcia");
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if(!window.confirm("Usunąć to zdjęcie?")) return;
    try {
      await deleteRoomPhoto(photoId);
      await loadRooms();
      
      const updatedRooms = await fetchAllRooms();
      const updatedRoom = updatedRooms.find(r => r.id === editingRoomId);
      if(updatedRoom) {
          setFormData(prev => ({...prev, photos: updatedRoom.photos}));
      }
      setRoomsList(updatedRooms);
    } catch(err) {
      alert("Błąd podczas usuwania zdjęcia");
    }
  };

  const handleSave = async () => {
    try {
      if (editingRoomId) {
        await updateRoom(editingRoomId, formData as RoomDTO);
      } else {
        await createRoom(formData as RoomDTO);
      }
      handleCloseDialog();
      await loadRooms();
    } catch (err) {
      alert("Wystąpił błąd podczas zapisywania pokoju.");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten pokój?")) {
      try {
        await deleteRoom(id);
        await loadRooms();
      } catch (err) {
        alert("Wystąpił błąd podczas usuwania pokoju.");
        console.error(err);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-4" 
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Powrót do Panelu
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-primary">Zarządzanie Pokojami</h1>
            <p className="text-gray-500 mt-2">Dodawaj, edytuj i usuwaj pokoje w systemie</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-primary text-white">
            <Plus className="mr-2 h-4 w-4" /> Nowy Pokój
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numery / Nazwa</TableHead>
                <TableHead>Miejsca</TableHead>
                <TableHead>Cena / Noc</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Ładowanie danych...</TableCell>
                </TableRow>
              ) : roomsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Brak pokoi w systemie.</TableCell>
                </TableRow>
              ) : (
                roomsList.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="font-medium">{room.name}</div>
                      <div className="text-sm text-gray-500">Pokój {room.roomNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600 gap-3">
                        <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> {room.maxGuests}</span>
                        <span className="flex items-center"><Bed className="h-3 w-3 mr-1" /> {room.bedCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-accent">{room.basePrice} {room.currency}</div>
                    </TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${room.status === 'DOSTEPNY' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {room.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(room)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(room.id)}>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRoomId ? 'Edytuj Pokój' : 'Dodaj Nowy Pokój'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Numer pokoju</Label>
                <Input 
                  id="roomNumber" 
                  name="roomNumber"
                  value={formData.roomNumber} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description} 
                onChange={handleChange} 
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Max. gości</Label>
                <Input 
                  id="maxGuests" 
                  name="maxGuests"
                  type="number"
                  min="1"
                  value={formData.maxGuests} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedCount">Ilość łóżek</Label>
                <Input 
                  id="bedCount" 
                  name="bedCount"
                  type="number"
                  min="1"
                  value={formData.bedCount} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Cena za noc</Label>
                <Input 
                  id="basePrice" 
                  name="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="DOSTEPNY">DOSTĘPNY</option>
                  <option value="SERWIS">SERWIS</option>
                  <option value="NIEDOSTEPNY">NIEDOSTĘPNY</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hotelId">Hotel / Lokalizacja</Label>
              <select 
                id="hotelId" 
                name="hotelId"
                value={formData.hotelId}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hotelsList.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.stars}★) - {hotel.description?.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
            {editingRoomId && (
              <div className="col-span-2 space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold">Zdjęcia</h3>
                
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Adres URL Zdjęcia</Label>
                    <Input 
                      placeholder="https://..." 
                      value={newPhotoUrl} 
                      onChange={e => setNewPhotoUrl(e.target.value)} 
                    />
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <input 
                      type="checkbox" 
                      id="isPrimary" 
                      checked={isPhotoPrimary} 
                      onChange={e => setIsPhotoPrimary(e.target.checked)} 
                    />
                    <Label htmlFor="isPrimary" className="text-sm">Główne</Label>
                  </div>
                  <Button type="button" onClick={handleAddPhoto} className="bg-primary text-white">Dodaj</Button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.photos && formData.photos.length > 0 ? (
                    formData.photos.map(photo => (
                      <div key={photo.id} className="relative group rounded overflow-hidden border">
                        <img src={photo.url} alt="Room" className="w-full h-24 object-cover" />
                        {photo.isPrimary && (
                          <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1 rounded-sm">Główne</div>
                        )}
                        <button 
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Trash className="h-5 w-5 text-red-400" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-sm text-gray-500 text-center py-2">Brak zdjęć dla tego pokoju.</div>
                  )}
                </div>
              </div>
            )}          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Anuluj</Button>
            <Button onClick={handleSave} className="bg-primary text-white">
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};