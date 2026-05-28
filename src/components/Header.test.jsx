import { render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import Header from './Header';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: '2023-10',
    setPeriod: vi.fn(),
    usuario: { plan: 'Free' },
    authUser: { displayName: 'Test User' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    clearNotificaciones: vi.fn(),
  }),
}));

it('renders the header', () => {
  render(<Header />);
  const userElement = screen.getByText(/Test User/i);
  expect(userElement).toBeInTheDocument();
});
