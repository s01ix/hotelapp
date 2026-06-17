import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SearchBar } from './SearchBar';
import * as AppContext from '../context/AppContext';

// mock tlumaczen
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));


vi.mock('../context/AppContext', () => ({
  useApp: vi.fn(),
}));

describe('SearchBar', () => {
  it('renderuje poprawnie pola', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      searchRooms: vi.fn(),
      isLoading: false,
    } as any);

    render(<SearchBar />);
    
    // klucz tlumaczen
    expect(screen.getByText(/searchBar\.checkIn/i)).toBeInTheDocument();
    expect(screen.getByText(/searchBar\.checkOut/i)).toBeInTheDocument();
    expect(screen.getByText(/searchBar\.guests/i)).toBeInTheDocument();
  });

  it('wyświetla stan ładowania', () => {
    vi.mocked(AppContext.useApp).mockReturnValue({
      searchRooms: vi.fn(),
      isLoading: true,
    } as any);

    render(<SearchBar />);
    
    // klucz ladowania 
    expect(screen.getByRole('button')).toHaveTextContent(/searchBar\.searching/i);
  });
});