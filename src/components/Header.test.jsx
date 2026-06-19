import { render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: '2024-01',
    setPeriod: vi.fn(),
    usuario: { name: 'Test User' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    authUser: { displayName: 'Test User' }
  });

  render(<Header />);
  const headerElement = screen.getByText(/Test User/i);
  expect(headerElement).toBeInTheDocument();
});
