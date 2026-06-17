import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AdminPanel } from './AdminPanel';

// mock nawigacji
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// mock tlumaczen 
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));


vi.mock('../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('AdminPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje poprawnie tytuł i wszystkie moduły', () => {
    render(<AdminPanel />);
    
    // check naglowkow 
    expect(screen.getByText('adminPanel.title')).toBeInTheDocument();
    expect(screen.getByText('adminPanel.subtitle')).toBeInTheDocument();

    // kafelki check
    expect(screen.getByText('adminPanel.modules.users.title')).toBeInTheDocument();
    expect(screen.getByText('adminPanel.modules.rooms.title')).toBeInTheDocument();
    expect(screen.getByText('adminPanel.modules.hotels.title')).toBeInTheDocument();
  });

  it('nawiguje do strony głównej po kliknięciu powrotu', async () => {
    render(<AdminPanel />);
    
    const backBtn = screen.getByText('adminPanel.backToSite');
    await userEvent.click(backBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('nawiguje do odpowiednich podstron po kliknięciu w kafelki', async () => {
    render(<AdminPanel />);
    
    // uzytkownicy
    await userEvent.click(screen.getByText('adminPanel.modules.users.title'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/users');

    // pokoje 
    await userEvent.click(screen.getByText('adminPanel.modules.rooms.title'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/rooms');

    // hotele 
    await userEvent.click(screen.getByText('adminPanel.modules.hotels.title'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/locations');
  });
});