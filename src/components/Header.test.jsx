import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: 'Marzo',
    setPeriod: vi.fn(),
    usuario: { plan: 'PRO' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { displayName: 'Hello User' },
  });

  render(<Header />);
  const headerElement = screen.getAllByText(/hello/i)[0];
  expect(headerElement).toBeInTheDocument();
});
