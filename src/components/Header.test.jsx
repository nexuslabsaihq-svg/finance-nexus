import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Header from './Header';

vi.mock('../context/AppDataContext', () => ({
  useAppData: vi.fn().mockReturnValue({
    period: '2024-01',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test User' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn()
  }),
}));

it('renders the header', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Usuario/i, { selector: '.uma-name' });
  expect(headerElement).toBeInTheDocument();
});
