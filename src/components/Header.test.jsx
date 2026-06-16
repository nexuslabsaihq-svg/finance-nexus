import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: '2025-03',
    setPeriod: vi.fn(),
    usuario: { nombre: 'TestUser' },
    authUser: { displayName: 'TestUser' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn()
  });

  render(<Header />);
  const userGreetings = screen.getAllByText(/TestUser/i);
  expect(userGreetings.length).toBeGreaterThan(0);
});
