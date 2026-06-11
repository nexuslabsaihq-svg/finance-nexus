import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { it, expect, vi } from 'vitest';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: '2023-10',
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
