import { render, screen } from '@testing-library/react';
import Header from './Header';
import { vi, it, expect } from 'vitest';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: '2023-10',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test User' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    authUser: { displayName: 'Test User', uid: '123' },
    loading: false
  })
}));

it('renders the header', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Test User/i);
  expect(headerElement).toBeInTheDocument();
});
