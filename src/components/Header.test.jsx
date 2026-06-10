import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, it, expect } from 'vitest';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: 'Marzo',
    setPeriod: vi.fn(),
    usuario: { plan: 'Free' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { displayName: 'John', email: 'john@example.com' }
  });

  render(<Header />);
  const headerElement = screen.getByText(/Hola,/i);
  expect(headerElement).toBeInTheDocument();
});
