import { render, screen } from '@testing-library/react';
import { vi, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: '',
    setPeriod: vi.fn(),
    usuario: {},
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { displayName: 'Usuario' }
  });

  render(<Header />);
  const headerElement = screen.getByText(/Usuario/i, { selector: 'span.uma-name' });
  expect(headerElement).toBeInTheDocument();
});
