import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, expect, it } from 'vitest';
import Header from './Header';
import * as AppDataContextModule from '../context/AppDataContext';

vi.spyOn(AppDataContextModule, 'useAppData').mockReturnValue({
  period: '2023-10',
  setPeriod: vi.fn(),
  usuario: { uid: 'user1', email: 'test@example.com' },
  authUser: { displayName: 'John Doe', email: 'test@example.com' },
  logout: vi.fn(),
  setActivePage: vi.fn(),
  notificaciones: []
});

it('renders the header with notification and user sections', () => {
  render(<Header />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
