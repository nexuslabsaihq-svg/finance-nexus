import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { it, expect, vi } from 'vitest';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
  period: '2024-06',
  setPeriod: vi.fn(),
  usuario: { nombre: 'Usuario' },
  authUser: { displayName: 'Usuario' },
  logout: vi.fn(),
  setActivePage: vi.fn(),
  notificaciones: []
});

it('renders the header', () => {
  render(<Header />);
  expect(screen.getAllByText('Usuario').length).toBeGreaterThan(0);
});
