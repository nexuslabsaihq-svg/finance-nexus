import { render } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

it('renders the header', () => {
  vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
    period: '2024-05',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test User', avatar: '' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: []
  });

  const { getAllByText } = render(<Header />);
  const notifElements = getAllByText(/Notificaciones/i);
  expect(notifElements.length).toBeGreaterThan(0);
});
