import { render, screen } from '@testing-library/react';
import Header from './Header';
import { it, expect, vi } from 'vitest';
import * as AppDataContextModule from '../context/AppDataContext';
import '@testing-library/jest-dom';

vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
  period: 'mensual',
  usuario: {},
  authUser: {},
  notificaciones: []
});


it('renders the header', () => {
  render(<Header />);
  const headerElement = screen.getByText(/Hola/i);
  expect(headerElement).toBeInTheDocument();
});
