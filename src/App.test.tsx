import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the primary navigation', async () => {
  render(<App />);
  const quranLinks = await screen.findAllByRole('link', { name: /quran/i });
  expect(quranLinks.length).toBeGreaterThan(0);
});
