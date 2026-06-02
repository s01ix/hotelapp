export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin'| 'USER' | 'ADMIN' | 'receptionist' | 'RECEPTIONIST';
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
  adults: number;
  children: number;
  roomName: string;
  notes?: string;
  userEmail?: string;
}

export interface RoomPhotoDTO {
    id: number;
    roomId: number;
    url: string;
    isPrimary: boolean;
}

export interface RoomDTO {
    id: number;
    hotelId: number;
    roomNumber: string;
    name: string;
    description: string;
    bedCount: number;
    maxGuests: number;
    basePrice: number;
    currency: string;
    status: string; 
    amenityIds: number[];
    amenities: string[];
    photos?: RoomPhotoDTO[];
}

export interface BookingDTO {
    roomId: number;
    userId: number;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    notes?: string;
}

export interface HotelDTO {
    id: number;
    name: string;
    description: string;
    stars: number;
    email: string;
    phone: string;
    locationId?: number;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const checkCurrentUser = async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include', 
    });
    
    if (!response.ok) {
        throw new Error('Błąd sprawdzania sesji użytkownika');
    }
    return response.json();
};

export const createBooking = async (booking: BookingDTO) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(booking)
    });

    if(!response.ok) {
        throw new Error("Błąd podczas tworzenia rezerwacji");
    }
    return response.json();
}

//funkcja do tworzenia platnosci
export const createPayment = async (paymentData: any) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(paymentData)
    });

    if(!response.ok) {
        throw new Error("Błąd podczas tworzenia płatności");
    }
    return response.json();
}

export const fetchAvailableRooms = async (checkIn: string, checkOut: string, maxGuests: number): Promise<RoomDTO[]> => {
    const url = new URL(`${API_BASE_URL}/rooms/available`);
    url.searchParams.append('checkIn', checkIn);
    url.searchParams.append('checkOut', checkOut);
    url.searchParams.append('maxGuests', maxGuests.toString());

    const response = await fetch(url.toString());

    if(!response.ok) {
        throw new Error("Błąd podczas pobierania dostępnych pokoi");
    }

    return response.json();
}

export const fetchAllRooms = async (): Promise<RoomDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    if(!response.ok) {
        throw new Error("Błąd podczas pobierania pokoi");
    }
    return response.json();
}

export const fetchAllHotels = async (): Promise<HotelDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/hotels`);
    if(!response.ok) {
        throw new Error("Błąd podczas pobierania hoteli");
    }
    return response.json();
}

export const createRoomPhoto = async (photoData: Partial<RoomPhotoDTO>): Promise<RoomPhotoDTO> => {
    const response = await fetch(`${API_BASE_URL}/room_photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(photoData)
    });
    if(!response.ok) {
        throw new Error("Błąd podczas dodawania zdjęcia");
    }
    return response.json();
}

export const deleteRoomPhoto = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/room_photos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if(!response.ok) {
        throw new Error("Błąd podczas usuwania zdjęcia");
    }
}

export const createRoom = async (roomData: RoomDTO): Promise<RoomDTO> => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(roomData)
    });
    if(!response.ok) {
        throw new Error("Błąd podczas tworzenia pokoju");
    }
    return response.json();
}

export const updateRoom = async (id: number, roomData: RoomDTO): Promise<RoomDTO> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(roomData)
    });
    if(!response.ok) {
        throw new Error("Błąd podczas aktualizacji pokoju");
    }
    return response.json();
}

export const deleteRoom = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if(!response.ok) {
        throw new Error("Błąd podczas usuwania pokoju");
    }
}

export const fetchRoomById = async (id : number): Promise<RoomDTO> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);

    if(!response.ok) {
        throw new Error("Błąd podczas pobierania szczegółów pokoju");
    }

    return response.json();
}

export const fetchMyBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/my`, {
        method: 'GET',
        credentials: 'include', 
    });
    
    if (!response.ok) {
        throw new Error('Błąd podczas pobierania Twoich rezerwacji');
    }
    return response.json();
};

export const fetchAllBookings = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {  
        method: 'GET',
        credentials: 'include',
    });

    if(!response.ok) {
        throw new Error("Błąd podczas pobierania wszystkich rezerwacji");
    }
    return response.json();    
};

export const updateBookingStatusInBackend = async (bookingId: number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ status })
    });

    if(!response.ok) {
        throw new Error("Błąd podczas aktualizacji statusu rezerwacji");
    }

    return response.text();
};

// Funkcja do pobierania wszystkich użytkowników
export const fetchAllUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        credentials: 'include',
    });

    if(!response.ok) {
        throw new Error("Błąd podczas pobierania użytkowników");
    }
    return response.json();
}
// Funkcja do aktualizacji roli użytkownika
export const updateUserRole = async (userId: number, newRole: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role?role=${newRole}`, {
    method: 'PUT',
    credentials: 'include',
});
if(!response.ok) {
    throw new Error("Błąd podczas aktualizacji roli użytkownika");
}
return response.text();
}