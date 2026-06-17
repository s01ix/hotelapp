import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { RoomDetails } from './RoomDetails';
import * as Api from '../components/service/api';
import * as AppContext from '../context/AppContext';

// Mock API
vi.mock('../components/service/api', () => ({
  fetchRoomById: vi.fn(),
  fetchRoomOpinions: vi.fn().mockResolvedValue([]),
}));

// Mock tłumaczeń
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock kontekstu
vi.mock('../context/AppContext', () => ({
  useApp: vi.fn(),
}));

// Mock routera
vi.mock('react-router', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => vi.fn(),
}));

describe('RoomDetails', () => {
  it('renderuje dane pokoju', async () => {
  
    vi.mocked(AppContext.useApp).mockReturnValue({
      searchParams: { checkIn: '2026-06-01', checkOut: '2026-06-05', guests: 2 },
      isLoggedIn: true
    } as any);

    vi.mocked(Api.fetchRoomById).mockResolvedValue({
      id: 1,
      name: 'Super Apartament',
      basePrice: 500,
      description: 'Piękny opis',
      maxGuests: 4,
      bedCount: 2,
      amenities: [] 
    } as any);

    render(<RoomDetails />);

    await waitFor(() => {
      expect(screen.getByText('Super Apartament')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});