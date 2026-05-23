import { render, screen } from '@testing-library/react';
import Header from './Header';
import { vi, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: '2024-05',
    setPeriod: vi.fn(),
    usuario: { name: 'Test User' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    setNotificaciones: vi.fn(),
    setBancos: vi.fn()
  }),
}));

describe('Header component', () => {
  it('renders without crashing', () => {
    render(<Header />);
  });
});
