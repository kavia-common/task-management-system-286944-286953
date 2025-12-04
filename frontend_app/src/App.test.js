import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const heading = screen.getByText(/Ocean To‑Do/i);
  expect(heading).toBeInTheDocument();
});
