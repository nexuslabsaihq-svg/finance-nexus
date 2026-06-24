import { render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: 'Enero',
    setPeriod: vi.fn(),
    usuario: { plan: 'Free' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { displayName: 'Hello User' },
  });

  render(<Header />);
  const headerElement = screen.getByText(/Hola,/i);
  expect(headerElement).toBeInTheDocument();
});
