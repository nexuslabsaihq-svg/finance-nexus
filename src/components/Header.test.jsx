import { render, screen } from '@testing-library/react';
import Header from './Header';
import { vi, it, expect } from 'vitest';

vi.mock('../context/AppDataContext', () => ({
  useAppData: () => ({
    period: '2024-01',
    setPeriod: vi.fn(),
    usuario: { nombre: 'Test User' },
    logout: vi.fn(),
    setActivePage: vi.fn(),
    notificaciones: [],
    chatsIA: [],
    setChatsIA: vi.fn(),
    ingresos: [],
    gastos: [],
    ahorros: [],
    deudas: [],
    bancos: [],
    inversiones: [],
    authUser: { displayName: 'Test User' }
  })
}));

it('renders the header with default values', () => {
  render(<Header />);
  const greeting = screen.getByText((content, element) => {
    return element.tagName.toLowerCase() === 'div' && element.classList.contains('greeting') && element.textContent.includes('Hola, Test');
  });
  expect(greeting).toBeDefined();
});
