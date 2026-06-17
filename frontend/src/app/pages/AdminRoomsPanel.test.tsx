import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdminRoomsPanel } from './AdminRoomsPanel';

// mock nawigacji 
const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

// mock tlumaczen 
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options && options.number) return `${key}:${options.number}`;
      if (options && options.count) return `${key}:${options.count}`;
      if (options && options.amenityName) return `${key}:${options.amenityName}`;
      return key;
    },
  }),
}));

// sztuczne dane 
const mockHotels = [
  { id: 1, name: 'Hotel Grand', stars: 5, locationId: 10 },
];

const mockAmenities = [
  { id: 1, name: 'Wi-Fi', category: 'Internet' },
];

const mockRooms = [
  {
    id: 1,
    roomNumber: '101',
    name: 'Pokój Standard',
    description: 'Zwykły pokój',
    bedCount: 2,
    maxGuests: 2,
    basePrice: 200,
    currency: 'PLN',
    status: 'DOSTEPNY',
    hotelId: 1,
    amenityIds: [1],
    photos: [{ id: 1, url: 'http://test.com/photo.jpg', isPrimary: true }],
  },
];


const apiMocks = vi.hoisted(() => ({
  fetchAllRooms: vi.fn(),
  fetchAllHotels: vi.fn(),
  fetchAllAmenities: vi.fn(),
  createRoom: vi.fn(),
  updateRoom: vi.fn(),
  deleteRoom: vi.fn(),
  createRoomPhoto: vi.fn(),
  deleteRoomPhoto: vi.fn(),
  createAmenity: vi.fn(),
  deleteAmenity: vi.fn(),
}));

vi.mock('../components/service/api', () => apiMocks);

// mock komponentow 
vi.mock('../components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('../components/ui/input', () => ({
  Input: React.forwardRef((props: any, ref) => <input ref={ref} {...props} />),
}));
vi.mock('../components/ui/textarea', () => ({
  Textarea: React.forwardRef((props: any, ref) => <textarea ref={ref} {...props} />),
}));
vi.mock('../components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));
vi.mock('../components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}));
vi.mock('../components/ui/dialog', () => ({
  Dialog: ({ open, children }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

describe('AdminRoomsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    apiMocks.fetchAllRooms.mockResolvedValue(mockRooms);
    apiMocks.fetchAllHotels.mockResolvedValue(mockHotels);
    apiMocks.fetchAllAmenities.mockResolvedValue(mockAmenities);
    
    apiMocks.createRoom.mockResolvedValue({});
    apiMocks.updateRoom.mockResolvedValue({});
    apiMocks.deleteRoom.mockResolvedValue({});
    apiMocks.createAmenity.mockResolvedValue({ id: 2, name: 'TV', category: 'Media' });
    apiMocks.deleteAmenity.mockResolvedValue({});
    apiMocks.createRoomPhoto.mockResolvedValue({});
    apiMocks.deleteRoomPhoto.mockResolvedValue({});

    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('wyświetla stan ładowania na początku', () => {
    apiMocks.fetchAllRooms.mockImplementation(() => new Promise(() => {}));
    render(<AdminRoomsPanel />);
    expect(screen.getByText('common.loadingData')).toBeInTheDocument();
  });

  it('pobiera i wyświetla listę pokoi', async () => {
    render(<AdminRoomsPanel />);
    
    expect(await screen.findByText('Pokój Standard')).toBeInTheDocument();
    expect(screen.getByText('admin.rooms.table.roomNumber:101')).toBeInTheDocument();
    expect(screen.getByText(/200 PLN/)).toBeInTheDocument();
  });

  it('pozwala wrócić do panelu admina', async () => {
    render(<AdminRoomsPanel />);
    const backBtn = screen.getByText(/admin.rooms.backToPanel/i);
    await userEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('otwiera formularz dodawania nowego pokoju i waliduje puste pola', async () => {
    render(<AdminRoomsPanel />);
    await screen.findByText('Pokój Standard');

    // okno dodania pokoju 
    await userEvent.click(screen.getByText(/admin.rooms.newRoomBtn/i));
    expect(screen.getByText('admin.rooms.dialog.addTitle')).toBeInTheDocument();

    // zapis bez pol 
    await userEvent.click(screen.getByText('admin.rooms.dialog.saveRoom'));

    //  komunikaty o polach wymaganych
    expect(await screen.findAllByText('admin.rooms.form.errors.required')).not.toHaveLength(0);
  });

  it('otwiera okno edycji i aktualizuje pokój', async () => {
    render(<AdminRoomsPanel />);
    await screen.findByText('Pokój Standard');

    const buttons = screen.getAllByRole('button');
    // edycja w tabeli 
    await userEvent.click(buttons[2]); 

    expect(await screen.findByText('admin.rooms.dialog.editTitle')).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue('Pokój Standard');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Pokój Zaktualizowany');

    await userEvent.click(screen.getByText('admin.rooms.dialog.saveRoom'));

    await waitFor(() => {
      expect(apiMocks.updateRoom).toHaveBeenCalledWith(1, expect.objectContaining({
        name: 'Pokój Zaktualizowany'
      }));
    });
  });

  it('pozwala usunąć pokój po potwierdzeniu', async () => {
    render(<AdminRoomsPanel />);
    await screen.findByText('Pokój Standard');

    const buttons = screen.getAllByRole('button');
    
    await userEvent.click(buttons[3]); 

    expect(window.confirm).toHaveBeenCalledWith('admin.rooms.alerts.deleteRoomConfirm');
    await waitFor(() => {
      expect(apiMocks.deleteRoom).toHaveBeenCalledWith(1);
    });
  });

  it('pozwala dodać nowe udogodnienie', async () => {
    render(<AdminRoomsPanel />);
    await screen.findByText('Pokój Standard');
    await userEvent.click(screen.getByText(/admin.rooms.newRoomBtn/i));

    // dodawanie udogodnien
    await userEvent.click(screen.getByText('admin.rooms.amenities.addNew'));

    const nameInput = screen.getByPlaceholderText('admin.rooms.amenities.namePlaceholder');
    await userEvent.type(nameInput, 'TV');

    await userEvent.click(screen.getByText('common.create'));

    await waitFor(() => {
      expect(apiMocks.createAmenity).toHaveBeenCalledWith(expect.objectContaining({
        name: 'TV'
      }));
    });
  });

  it('blokuje usunięcie udogodnienia, które jest w użyciu', async () => {
    render(<AdminRoomsPanel />);
    await screen.findByText('Pokój Standard');
    await userEvent.click(screen.getByText(/admin.rooms.newRoomBtn/i));

    // title tooltip ikony
    const deleteAmenityBtn = screen.getByTitle('admin.rooms.amenities.deleteTooltip');
    await userEvent.click(deleteAmenityBtn);

    
    expect(await screen.findByText(/admin.rooms.usageDialog.title/i)).toBeInTheDocument();
    expect(screen.getByText(/Pokój Standard \(Nr 101\)/i)).toBeInTheDocument();
  });
});