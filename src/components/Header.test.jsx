import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: '2023-10',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test User', plan: 'Básico' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    clearNotificaciones: vi.fn(),
    marcarLeidas: vi.fn(),
    ingresos: [],
    gastos: [],
    authUser: { uid: '123', displayName: 'Test User' },
    authLoading: false
  })
}));

describe('Header component', () => {
  it('renders the header', () => {
    render(<Header />);
    const userElements = screen.getAllByText(/Test User/i);
    expect(userElements.length).toBeGreaterThan(0);
  });
});
