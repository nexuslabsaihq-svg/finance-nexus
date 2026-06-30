import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
  period: '2023-10',
  setPeriod: vi.fn(),
  usuario: { displayName: 'Test User' },
  logout: vi.fn(),
  setActivePage: vi.fn(),
  notificaciones: [],
});

it('renders the header', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Hola/i);
  expect(headerElement).toBeInTheDocument();
});
