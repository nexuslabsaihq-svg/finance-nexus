import { render, screen } from '@testing-library/react';
import Header from './Header';
import { AppDataContext } from '../context/AppDataContext';
import { vi } from 'vitest';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: 'Marzo',
    setPeriod: vi.fn(),
    usuario: { nombre: 'User', plan: 'PRO' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { displayName: 'User', email: 'user@email.com' }
  })
}));

it('renders the header with correct user name', () => {
  render(<Header />);
  const headerElements = screen.getAllByText(/User/i);
  expect(headerElements.length).toBeGreaterThan(0);
});
