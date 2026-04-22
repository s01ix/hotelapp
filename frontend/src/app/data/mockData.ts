export interface Room {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  image: string;
  amenities: string[];
  maxGuests: number;
  size: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'paid' | 'pending' | 'confirmed';
  paymentMethod: 'online' | 'offline';
  userName?: string;
}

export const rooms: Room[] = [
  {
    id: '1',
    name: 'Pokoj Deluxe',
    description: 'Elegancki pokoj z lozkiem typu king-size, widokiem na miasto i nowoczesnymi udogodnieniami.',
    pricePerNight: 199,
    image: 'https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzc0MjcwMjY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    amenities: ['Darmowe WiFi', 'Klimatyzacja', 'Mini Bar', 'Smart TV', 'Obsluga pokoju'],
    maxGuests: 2,
    size: '35 m²',
  },
  {
    id: '2',
    name: 'Apartament',
    description: 'Przestronny apartament z oddzielna strefa dzienna, meblami premium i wspanialym widokiem.',
    pricePerNight: 349,
    image: 'https://images.unsplash.com/photo-1509647924673-bbb53e22eeb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHN1aXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0MjQwOTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    amenities: ['Darmowe WiFi', 'Klimatyzacja', 'Mini Bar', 'Smart TV', 'Obsluga pokoju', 'Balkon', 'Ekspres do kawy'],
    maxGuests: 3,
    size: '55 m²',
  },
  {
    id: '3',
    name: 'Pokoj Premium Dwuosobowy',
    description: 'Wspolczesny pokoj z dwoma lozkami typu queen, idealny dla rodzin lub przyjaciol.',
    pricePerNight: 249,
    image: 'https://images.unsplash.com/photo-1559414059-34fe0a59e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHBlbnRob3VzZSUyMHN1aXRlfGVufDF8fHx8MTc3NDI3OTY1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    amenities: ['Darmowe WiFi', 'Klimatyzacja', 'Smart TV', 'Sejf', 'Biurko do pracy'],
    maxGuests: 4,
    size: '42 m²',
  },
  {
    id: '4',
    name: 'Pokoj Jednoosobowy',
    description: 'Przytulny i stylowy pokoj zaprojektowany dla podrozujacych solo, szukajacych komfortu.',
    pricePerNight: 129,
    image: 'https://images.unsplash.com/photo-1667125095636-dce94dcbdd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NzQyNzk2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    amenities: ['Darmowe WiFi', 'Klimatyzacja', 'Smart TV', 'Biurko do pracy'],
    maxGuests: 1,
    size: '25 m²',
  },
  {
    id: '5',
    name: 'Apartament Royal Penthouse',
    description: 'Najwyzszy luksus z panoramicznym widokiem, prywatnym tarasem i ekskluzywnymi uslugami.',
    pricePerNight: 599,
    image: 'https://images.unsplash.com/photo-1734356972273-f19d4eac8c7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5JTIwZW50cmFuY2V8ZW58MXx8fHwxNzc0Mjc5NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    amenities: ['Darmowe WiFi', 'Klimatyzacja', 'Mini Bar', 'Smart TV', 'Obsluga pokoju', 'Prywatny Taras', 'Ekspres do kawy', 'Jacuzzi', 'Obsluga lokaja'],
    maxGuests: 4,
    size: '120 m²',
  },
  {
    id: '6',
    name: 'Pokoj Standardowy ',
    description: 'Komfortowy pokoj z dwoma lozkami pojedynczymi, idealny dla osob dbajacych o budzet.',
    pricePerNight: 149,
    image: 'https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzc0MjcwMjY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    amenities: ['Darmowe WiFi', 'Klimatyzacja', 'TV'],
    maxGuests: 2,
    size: '28 m²',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    userId: 'user1',
    roomId: '1',
    roomName: 'Pokoj Deluxe',
    checkIn: '2026-04-15',
    checkOut: '2026-04-18',
    guests: 2,
    totalPrice: 597,
    status: 'paid',
    paymentMethod: 'online',
    userName: 'Jan Kowalski',
  },
  {
    id: 'BK003',
    userId: 'user2',
    roomId: '3',
    roomName: 'Pokoj Premium Dwuosobowy',
    checkIn: '2026-03-28',
    checkOut: '2026-03-30',
    guests: 4,
    totalPrice: 498,
    status: 'pending',
    paymentMethod: 'offline',
    userName: 'Anna Nowak',
  },
  {
    id: 'BK004',
    userId: 'user3',
    roomId: '5',
    roomName: 'Apartament Royal Penthouse',
    checkIn: '2026-04-05',
    checkOut: '2026-04-08',
    guests: 2,
    totalPrice: 1797,
    status: 'pending',
    paymentMethod: 'offline',
    userName: 'Michal Wisniewski',
  },
];