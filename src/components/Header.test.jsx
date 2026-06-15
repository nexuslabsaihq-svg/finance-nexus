import { render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: '2023-10',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test User' },
    authUser: { displayName: 'Test User', email: 'test@example.com' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: []
  });

  render(<Header />);

  const headerElement = screen.getByText(/Test User/i);
  expect(headerElement).toBeInTheDocument();
});
