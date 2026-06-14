import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { it, expect, vi } from 'vitest';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: '2023-10',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Usuario' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: []
  });

  render(<Header />);
  const headerElement = screen.getAllByText(/Usuario/i)[0];
  expect(headerElement).toBeInTheDocument();
});
