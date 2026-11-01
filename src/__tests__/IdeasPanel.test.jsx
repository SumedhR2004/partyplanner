import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IdeasPanel from '../components/IdeasPanel.jsx';

const DEFAULT_PROPS = {
  eventType: 'birthday',
  theme: 'Neon glow party',
  city: 'Bengaluru',
  budget: 200_000,
  guestCount: 50,
};

const MOCK_IDEAS = [
  { category: 'Decor', title: 'Neon Signs', description: 'Bright neon signs for photos.' },
  { category: 'Food & Drinks', title: 'Cocktail Bar', description: 'Build your own mocktails.' },
  { category: 'Activities', title: 'Dance Floor', description: 'Open dance floor with DJ.' },
  { category: 'Budget-Saving Tips', title: 'DIY Decorations', description: 'Make your own.' },
  { category: 'Local Experience', title: 'Local Band', description: 'Hire a Bengaluru band.' },
];

/** The exact aria-label on the trigger button. */
const BTN_LABEL = /get personalised event ideas/i;

describe('IdeasPanel', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = undefined;
  });

  it('renders the initial "Get Personalised Ideas" button', () => {
    render(<IdeasPanel {...DEFAULT_PROPS} />);
    expect(screen.getByRole('button', { name: BTN_LABEL })).toBeInTheDocument();
  });

  it('shows a loading state immediately after button click', async () => {
    // Fetch that never resolves during this check
    global.fetch = vi.fn(() => new Promise(() => {}));

    render(<IdeasPanel {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: BTN_LABEL }));

    expect(screen.getByText(/crafting personalised ideas/i)).toBeInTheDocument();
  });

  it('renders ideas on successful API response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ideas: MOCK_IDEAS }),
      })
    );

    render(<IdeasPanel {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: BTN_LABEL }));

    await waitFor(() => {
      expect(screen.getByText('Neon Signs')).toBeInTheDocument();
    });

    expect(screen.getByText('Cocktail Bar')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it('shows fallback ideas and offline notice when fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<IdeasPanel {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: BTN_LABEL }));

    await waitFor(() => {
      expect(screen.getByText(/offline ideas mode/i)).toBeInTheDocument();
    });

    // Fallback ideas should be rendered (5 articles)
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it('shows fallback when API returns non-OK status', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ error: 'Service unavailable' }),
      })
    );

    render(<IdeasPanel {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: BTN_LABEL }));

    await waitFor(() => {
      expect(screen.getByText(/offline ideas mode/i)).toBeInTheDocument();
    });
  });

  it('shows a regenerate button after ideas are loaded', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ideas: MOCK_IDEAS }),
      })
    );

    render(<IdeasPanel {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: BTN_LABEL }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /regenerate ideas/i })).toBeInTheDocument();
    });
  });

  it('has aria-live region for loading state', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));

    render(<IdeasPanel {...DEFAULT_PROPS} />);
    fireEvent.click(screen.getByRole('button', { name: BTN_LABEL }));

    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).not.toBeNull();
  });
});
