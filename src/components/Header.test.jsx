import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Header from './Header';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: 'Enero',
    setPeriod: vi.fn(),
    usuario: { plan: 'Pro' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { displayName: 'John Doe', email: 'john@example.com' }
  })
}));

it('renders the header', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Hola, /i);
  expect(headerElement).toBeInTheDocument();
});
