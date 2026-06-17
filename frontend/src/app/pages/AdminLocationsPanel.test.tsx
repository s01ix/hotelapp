// AdminLocationsPanel.test.tsx

import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AdminLocationsPanel } from './AdminLocationsPanel';

const mockNavigate = vi.fn();

const mockHotels = [
  {
    id: 1,
    name: 'Hotel Test',
    description: 'Opis hotelu',
    email: 'hotel@test.pl',
    phone: '123456789',
    stars: 4,
    locationId: 10,
  },
];

const mockLocations = [
  {
    id: 10,
    street: 'Warszawska',
    buildingNumber: '1',
    city: 'Kraków',
    postalCode: '30-001',
    country: 'Polska',
  },
];

const apiMocks = vi.hoisted(() => ({
  fetchAllHotels: vi.fn(),
  fetchAllLocations: vi.fn(),
  createHotel: vi.fn(),
  updateHotel: vi.fn(),
  deleteHotel: vi.fn(),
  createLocation: vi.fn(),
  updateLocation: vi.fn(),
  deleteLocation: vi.fn(),
}));

vi.mock('../components/service/api', () => ({
  ...apiMocks,
}));

vi.mock('../context/AppContext', () => ({
  useApp: () => ({
    user: {
      id: 1,
      role: 'ADMIN',
    },
  }),
}));

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (options?.name) {
        return `${key}:${options.name}`;
      }

      return key;
    },
  }),
}));

vi.mock('../components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('../components/ui/input', () => ({
  Input: React.forwardRef((props: any, ref) => (
    <input ref={ref} {...props} />
  )),
}));

vi.mock('../components/ui/textarea', () => ({
  Textarea: React.forwardRef((props: any, ref) => (
    <textarea ref={ref} {...props} />
  )),
}));

vi.mock('../components/ui/label', () => ({
  Label: ({ children }: any) => <label>{children}</label>,
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
  Dialog: ({ open, children }: any) => (open ? children : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

describe('AdminLocationsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    apiMocks.fetchAllHotels.mockResolvedValue(mockHotels);
    apiMocks.fetchAllLocations.mockResolvedValue(mockLocations);

    apiMocks.createLocation.mockResolvedValue({
      id: 100,
    });

    apiMocks.createHotel.mockResolvedValue({});
    apiMocks.updateHotel.mockResolvedValue({});
    apiMocks.updateLocation.mockResolvedValue({});
    apiMocks.deleteHotel.mockResolvedValue({});
    apiMocks.deleteLocation.mockResolvedValue({});

    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('renders loading state initially', () => {
    apiMocks.fetchAllHotels.mockImplementation(
      () => new Promise(() => {})
    );

    apiMocks.fetchAllLocations.mockImplementation(
      () => new Promise(() => {})
    );

    render(<AdminLocationsPanel />);

    expect(
      screen.getByText('adminLocations.loading')
    ).toBeInTheDocument();
  });

  it('loads and renders hotels list', async () => {
    render(<AdminLocationsPanel />);

    expect(
      await screen.findByText('Hotel Test')
    ).toBeInTheDocument();

    expect(
      screen.getByText('hotel@test.pl')
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Kraków/)
    ).toBeInTheDocument();

    expect(apiMocks.fetchAllHotels).toHaveBeenCalledOnce();
    expect(apiMocks.fetchAllLocations).toHaveBeenCalledOnce();
  });

  it('renders empty state when no hotels exist', async () => {
    apiMocks.fetchAllHotels.mockResolvedValue([]);

    render(<AdminLocationsPanel />);

    expect(
      await screen.findByText('adminLocations.noHotels')
    ).toBeInTheDocument();
  });

  it('handles API loading errors', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    apiMocks.fetchAllHotels.mockRejectedValue(
      new Error('Network Error')
    );

    render(<AdminLocationsPanel />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  it('navigates back to admin panel', async () => {
    render(<AdminLocationsPanel />);

    const backButton = screen.getByText(
      'adminLocations.backToPanel'
    );

    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('opens add hotel dialog', async () => {
    render(<AdminLocationsPanel />);

    const addButton = screen.getByText(
      'adminLocations.addHotel'
    );

    await userEvent.click(addButton);

    expect(
      screen.getByText('adminLocations.dialog.addTitle')
    ).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<AdminLocationsPanel />);

    await userEvent.click(
      screen.getByText('adminLocations.addHotel')
    );

    await userEvent.click(
      screen.getByText('adminLocations.dialog.save')
    );

    expect(
      await screen.findAllByText(
        'adminLocations.form.errors.fieldRequired'
      )
    ).not.toHaveLength(0);
  });

  it('creates new hotel and location', async () => {
    render(<AdminLocationsPanel />);

    await userEvent.click(
      screen.getByText('adminLocations.addHotel')
    );

    const inputs = screen.getAllByRole('textbox');

    await userEvent.type(inputs[0], 'Nowy Hotel');
    await userEvent.type(inputs[1], 'Opis');
    await userEvent.type(inputs[2], 'new@test.pl');
    await userEvent.type(inputs[3], '123456789');
    await userEvent.type(inputs[4], 'Warszawska');
    await userEvent.type(inputs[5], '12');
    await userEvent.type(inputs[6], 'Warszawa');
    await userEvent.type(inputs[7], '00-001');
    await userEvent.type(inputs[8], 'Polska');

    const starsInput = screen.getByDisplayValue('3');

    fireEvent.change(starsInput, {
      target: { value: '5' },
    });

    await userEvent.click(
      screen.getByText('adminLocations.dialog.save')
    );

    await waitFor(() => {
      expect(apiMocks.createLocation).toHaveBeenCalled();
    });

    expect(apiMocks.createHotel).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Nowy Hotel',
        locationId: 100,
      })
    );
  });

  it('opens edit dialog with hotel data', async () => {
    render(<AdminLocationsPanel />);
    await screen.findByText('Hotel Test');
    const editButtons = screen.getAllByRole('button');
    await userEvent.click(editButtons[2]);

    expect(
      await screen.findByText('adminLocations.dialog.editTitle')
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue('Hotel Test') 
    ).toBeInTheDocument();
  });

  it('updates existing hotel', async () => {
    render(<AdminLocationsPanel />);
    await screen.findByText('Hotel Test');
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]);

    const nameInput = screen.getByDisplayValue('Hotel Test');

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Hotel Updated');

    await userEvent.click(
      screen.getByText('adminLocations.dialog.save')
    );

    await waitFor(() => {
      expect(apiMocks.updateLocation).toHaveBeenCalled();
      expect(apiMocks.updateHotel).toHaveBeenCalled();
    });
  });

  it('deletes hotel and unused location', async () => {
    render(<AdminLocationsPanel />);

    await screen.findByText('Hotel Test');

    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[3]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
    });

    expect(apiMocks.deleteHotel).toHaveBeenCalledWith(1);
    expect(apiMocks.deleteLocation).toHaveBeenCalledWith(10);
  });

  it('shows translated alert when save fails', async () => {
    apiMocks.createLocation.mockRejectedValue(
      new Error('save error')
    );

    render(<AdminLocationsPanel />);

    await userEvent.click(
      screen.getByText('adminLocations.addHotel')
    );

    const inputs = screen.getAllByRole('textbox');

    await userEvent.type(inputs[0], 'Hotel');
    await userEvent.type(inputs[1], 'Opis');
    await userEvent.type(inputs[2], 'mail@test.pl');
    await userEvent.type(inputs[3], '123123123');
    await userEvent.type(inputs[4], 'Street');
    await userEvent.type(inputs[5], '1');
    await userEvent.type(inputs[6], 'City');
    await userEvent.type(inputs[7], '00-000');
    await userEvent.type(inputs[8], 'Polska');

    await userEvent.click(
      screen.getByText('adminLocations.dialog.save')
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'adminLocations.errors.save'
      );
    });
  });

  it('uses i18n keys correctly', async () => {
    render(<AdminLocationsPanel />);

    expect(
      screen.getByText('adminLocations.title')
    ).toBeInTheDocument();

    expect(
      screen.getByText('adminLocations.subtitle')
    ).toBeInTheDocument();

    expect(
      screen.getByText('adminLocations.listTitle')
    ).toBeInTheDocument();
  });
});