import { it, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
  period: '2024-03',
  setPeriod: vi.fn(),
  usuario: { nombre: 'Test User' },
  logout: vi.fn(),
  setActivePage: vi.fn(),
  notificaciones: []
});

it('renders the header', () => {
  render(<Header />);
});
