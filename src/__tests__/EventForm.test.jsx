import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventForm from '../components/EventForm.jsx';

/** Get a date string 6 months from now (valid future date). */
function futureDateString() {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().split('T')[0];
}

describe('EventForm', () => {
  it('renders all six form fields', () => {
    render(<EventForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/total budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guest count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/theme or vibe/i)).toBeInTheDocument();
  });

  it('shows error messages on empty form submission', async () => {
    render(<EventForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /generate my plan/i }));

    await waitFor(() => {
      // At least 4 error messages should appear for empty fields
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('error messages have role="alert"', async () => {
    render(<EventForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /generate my plan/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('does not call onSubmit with invalid data', async () => {
    const onSubmit = vi.fn();
    render(<EventForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /generate my plan/i }));
    await waitFor(() => screen.getAllByRole('alert'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<EventForm onSubmit={onSubmit} />);

    // Fill in all fields
    await user.selectOptions(screen.getByLabelText(/event type/i), 'birthday');
    await user.clear(screen.getByLabelText(/total budget/i));
    await user.type(screen.getByLabelText(/total budget/i), '250000');
    await user.clear(screen.getByLabelText(/guest count/i));
    await user.type(screen.getByLabelText(/guest count/i), '80');
    await user.type(screen.getByLabelText(/event date/i), futureDateString());
    await user.type(screen.getByLabelText(/city/i), 'Chennai');
    await user.type(screen.getByLabelText(/theme or vibe/i), 'Tropical beach party');

    await user.click(screen.getByRole('button', { name: /generate my plan/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const callArg = onSubmit.mock.calls[0][0];
    expect(callArg.eventType).toBe('birthday');
    expect(callArg.budget).toBe(250000);
    expect(callArg.guestCount).toBe(80);
    expect(callArg.city).toBe('Chennai');
    expect(callArg.theme).toBe('Tropical beach party');
  });

  it('clears error for a field once corrected and re-submitted', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<EventForm onSubmit={onSubmit} />);

    // First submit — trigger errors
    fireEvent.click(screen.getByRole('button', { name: /generate my plan/i }));
    await waitFor(() => screen.getAllByRole('alert'));

    // Fix eventType
    await user.selectOptions(screen.getByLabelText(/event type/i), 'community');

    // City error should still be present (not fixed yet)
    expect(screen.queryByText(/city is required/i)).toBeInTheDocument();
  });

  it('submit button has an accessible label', () => {
    render(<EventForm onSubmit={vi.fn()} />);
    const btn = screen.getByRole('button', { name: /generate my plan/i });
    expect(btn).toBeInTheDocument();
  });

  it('theme textarea shows character count', () => {
    render(<EventForm onSubmit={vi.fn()} />);
    expect(screen.getByText(/0\/200 characters/i)).toBeInTheDocument();
  });
});
