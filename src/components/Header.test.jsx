import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: 'Mar 2024',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test User' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    authUser: { displayName: 'Test User' }
  })
}));

describe('Header component', () => {
  it('renders the header user name', () => {
    render(<Header />);
    const headerElement = screen.getByText(/Test User/i);
    expect(headerElement).toBeInTheDocument();
  });
});
