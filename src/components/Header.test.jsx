import { render, screen } from '@testing-library/react';
import Header from './Header';
import { vi, expect, it } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: 'Marzo',
    setPeriod: vi.fn(),
    usuario: {},
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { displayName: 'John Doe' }
  })
}));

it('renders the header', () => {
  render(<Header />);
  const headerElements = screen.getAllByText(/John/i);
  expect(headerElements.length).toBeGreaterThan(0);
});
