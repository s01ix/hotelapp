import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Homepage } from './Homepage';
import * as AppContext from '../context/AppContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../context/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('../components/RoomCard', () => ({
  RoomCard: () => <div data-testid="room-card" />
}));

vi.mock('../components/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar" />
}));
vi.spyOn(console, 'error').mockImplementation(() => {});
describe('Homepage', () => {
  it('wyświetla stan początkowy', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      isLoading: false,
      error: null,
      searchParams: null,
      rooms: []
    } as any);

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    // szukanie klucza zamiast bledu
    expect(screen.getByText(/home\.hero\.discover/i)).toBeInTheDocument();
  });

  it('wyświetla błąd', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      isLoading: false,
      error: 'Błąd sieci', 
      searchParams: null,
      rooms: []
    } as any);

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    expect(screen.getByText(/home\.states\.error/i)).toBeInTheDocument();
  });

  it('wyświetla listę pokoi', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      isLoading: false,
      error: null,
      searchParams: { checkIn: '2026-06-20', checkOut: '2026-06-25', guests: 2 },
      rooms: [{ id: 1, name: 'Test' }]
    } as any);

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    expect(screen.getAllByTestId('room-card')).toHaveLength(1);
  });
});