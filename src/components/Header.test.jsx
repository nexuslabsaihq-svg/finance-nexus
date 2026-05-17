import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { AppDataContext } from '../context/AppDataContext';
import { vi } from 'vitest';

vi.mock('../context/AppDataContext', () => {
  return {
    useAppData: () => ({
      period: 'Marzo',
      setPeriod: vi.fn(),
      usuario: { plan: 'PRO' },
      logout: vi.fn(),
      setActivePage: vi.fn(),
      notificaciones: [],
      setNotificaciones: vi.fn(),
      ingresos: [],
      gastos: [],
      authUser: { displayName: 'Usuario Test' }
    }),
    AppDataProvider: ({ children }) => <div>{children}</div>
  };
});

it('renders the header', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Hola/i);
  expect(headerElement).toBeInTheDocument();
});
