export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin'| 'USER' | 'ADMIN';
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


const API_BASE_URL = 'http://localhost:8080/api';

//funkcja do sprawdzania aktualnie zalogowanego użytkownika
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
//funkcja do tworzenia rezerwacji
export const createBooking = async (booking: BookingDTO): Promise<Booking> => {
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

//funkcja do pobierania dostępnych pokoi
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
//funkcja do pobierania szczegółów pokoju
export const fetchRoomById = async (id : number): Promise<RoomDTO> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);

    if(!response.ok) {
        throw new Error("Błąd podczas pobierania szczegółów pokoju");
    }

    return response.json();
}
// funkcja do pobierania rezerwacji zalogowanego użytkownika
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
//funkcja do pobierania wszystkich rezerwacji (dla admina)
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
// funkcja do aktualizacji statusu rezerwacji (dla admina)
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