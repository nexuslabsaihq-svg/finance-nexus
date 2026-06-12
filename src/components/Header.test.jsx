import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { it, expect, vi } from 'vitest';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: 'Marzo',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test', foto: null },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: []
  });

  render(<Header />);
  const headerElement = screen.getByText(/Mar/i);
  expect(headerElement).toBeInTheDocument();
});
