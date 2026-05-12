import { render, screen } from '@testing-library/react';
import Header from './Header';

it('renders the header', () => {
  render(<Header />);
  const headerElement = screen.getByText(/hello/i);
  expect(headerElement).toBeInTheDocument();
});
