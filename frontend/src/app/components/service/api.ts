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
  roomId?: number;
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

export interface LocationDTO{
    id: number;
    street: string;
    buildingNumber: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Opinion {
  id?: number;
  bookingId: number;
  userId: number;
  roomId: number;
  rate: number;
  comment: string;
  createdAt?: string;
  roomName?: string;
  userName?: string;
}

export interface OpinionFormData {
  bookingId: number;
  roomId: number;
  rate: number;
  comment: string;
}

export interface AmenityDTO {
  id: number;
  name: string;
  category: string;
  description: string;
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
// Funkcja do pobierania WSZYSTKICH pokoi z bazy (na stronę główną)
export const fetchAllRooms = async (): Promise<RoomDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error("Błąd podczas pobierania wszystkich pokoi");
    }

    return response.json();
};


export const fetchAllHotels = async (): Promise<HotelDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(!response.ok) {
        throw new Error("Błąd podczas pobierania hoteli");
    }
    return response.json();
}

export const createHotel = async (hotelData: Partial<HotelDTO>): Promise<HotelDTO> => {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(hotelData)
    });
    if(!response.ok) {
        throw new Error("Błąd podczas tworzenia hotelu");
    }
    return response.json();
}

export const updateHotel = async (id: number, hotelData: Partial<HotelDTO>): Promise<HotelDTO> => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(hotelData)
    });
    if(!response.ok) {
        throw new Error("Błąd podczas aktualizacji hotelu");
    }
    return response.json();
}

export const deleteHotel = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if(!response.ok) {
        throw new Error("Błąd podczas usuwania hotelu");
    }
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

export const fetchAllLocations = async (): Promise<LocationDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'GET',
        credentials: 'include', // <-- BRAKOWAŁO TEGO
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(!response.ok) {
        throw new Error("Błąd podczas pobierania lokalizacji");
    }
    return response.json();
}

export const createLocation = async (locationData: Partial<LocationDTO>): Promise<LocationDTO> => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(locationData)
    });
    if(!response.ok) {
        throw new Error("Błąd podczas tworzenia lokalizacji");
    }
    return response.json();
}

export const updateLocation = async (id: number, locationData: Partial<LocationDTO>): Promise<LocationDTO> => {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(locationData)
    });
    if(!response.ok) {
        throw new Error("Błąd podczas aktualizacji lokalizacji");
    }
    return response.json();
}

export const deleteLocation = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if(!response.ok) {
        throw new Error("Błąd podczas usuwania lokalizacji");
    }
}

export const fetchAllOpinions = async (): Promise<Opinion[]> => {
    const response = await fetch(`${API_BASE_URL}/opinions`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Błąd podczas pobierania opinii');
    }
    return response.json();
};

export const fetchUserOpinions = async (userId: number): Promise<Opinion[]> => {
    const response = await fetch(`${API_BASE_URL}/opinions/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Błąd podczas pobierania opinii użytkownika');
    }
    return response.json();
};

export const fetchRoomOpinions = async (roomId: number): Promise<Opinion[]> => {
    const response = await fetch(`${API_BASE_URL}/opinions/room/${roomId}`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Błąd podczas pobierania opinii pokoju');
    }
    return response.json();
};

export const canReviewBooking = async (bookingId: number, userId: number): Promise<boolean> => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/opinions/can-review/${bookingId}/user/${userId}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );
        if (!response.ok) return false;
        const data = await response.json();
        return data.canReview;
    } catch (error) {
        console.error('Błąd sprawdzania możliwości wystawienia opinii:', error);
        return false;
    }
};

export const createOpinion = async (userId: number, opinion: OpinionFormData): Promise<Opinion> => {
    const response = await fetch(`${API_BASE_URL}/opinions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            ...opinion,
            userId,
        }),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Nie udało się dodać opinii');
    }
    
    return response.json();
};

export const updateOpinion = async (
    id: number,
    userId: number,
    opinion: Partial<OpinionFormData>
): Promise<Opinion> => {
    const response = await fetch(`${API_BASE_URL}/opinions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            ...opinion,
            userId,
        }),
    });
    
    if (!response.ok) {
        throw new Error('Nie udało się zaktualizować opinii');
    }
    
    return response.json();
};

export const deleteOpinion = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/opinions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error('Nie udało się usunąć opinii');
    }
};

export const fetchAllAmenities = async (): Promise<AmenityDTO[]> => {
  const response = await fetch(`${API_BASE_URL}/amenities`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Błąd podczas pobierania udogodnień');
  }
  return response.json();
};

export const createAmenity = async (amenity: Partial<AmenityDTO>): Promise<AmenityDTO> => {
  const response = await fetch(`${API_BASE_URL}/amenities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(amenity),
  });
  if (!response.ok) {
    throw new Error('Błąd podczas tworzenia udogodnienia');
  }
  return response.json();
};

export const updateAmenity = async (id: number, amenity: Partial<AmenityDTO>): Promise<AmenityDTO> => {
  const response = await fetch(`${API_BASE_URL}/amenities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(amenity),
  });
  if (!response.ok) {
    throw new Error('Błąd podczas aktualizacji udogodnienia');
  }
  return response.json();
};

export const deleteAmenity = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/amenities/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Błąd podczas usuwania udogodnienia');
  }
};
