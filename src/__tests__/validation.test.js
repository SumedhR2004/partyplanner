import { describe, it, expect } from 'vitest';
import { validateEventForm, validateField, VALID_EVENT_TYPES } from '../utils/validation.js';

/** Build a fully valid form data object for tests. */
function validForm(overrides = {}) {
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);
  return {
    eventType: 'wedding',
    budget: '500000',
    guestCount: '150',
    eventDate: futureDate.toISOString().split('T')[0],
    city: 'Mumbai',
    theme: 'Rustic bohemian with fairy lights',
    ...overrides,
  };
}

describe('validateEventForm', () => {
  describe('valid data', () => {
    it('returns isValid = true for fully valid input', () => {
      const result = validateEventForm(validForm());
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    VALID_EVENT_TYPES.forEach((type) => {
      it(`accepts event type "${type}"`, () => {
        const result = validateEventForm(validForm({ eventType: type }));
        expect(result.errors.eventType).toBeUndefined();
      });
    });
  });

  describe('eventType validation', () => {
    it('rejects empty eventType', () => {
      const result = validateEventForm(validForm({ eventType: '' }));
      expect(result.errors.eventType).toBeDefined();
      expect(result.isValid).toBe(false);
    });

    it('rejects unknown event type', () => {
      const result = validateEventForm(validForm({ eventType: 'concert' }));
      expect(result.errors.eventType).toBeDefined();
    });
  });

  describe('budget validation', () => {
    it('rejects empty budget', () => {
      const result = validateEventForm(validForm({ budget: '' }));
      expect(result.errors.budget).toBeDefined();
    });

    it('rejects budget below minimum (999)', () => {
      const result = validateEventForm(validForm({ budget: '999' }));
      expect(result.errors.budget).toBeDefined();
    });

    it('accepts budget at minimum (1000)', () => {
      const result = validateEventForm(validForm({ budget: '1000' }));
      expect(result.errors.budget).toBeUndefined();
    });

    it('rejects non-numeric budget', () => {
      const result = validateEventForm(validForm({ budget: 'abc' }));
      expect(result.errors.budget).toBeDefined();
    });

    it('rejects negative budget', () => {
      const result = validateEventForm(validForm({ budget: '-1000' }));
      expect(result.errors.budget).toBeDefined();
    });

    it('rejects zero budget', () => {
      const result = validateEventForm(validForm({ budget: '0' }));
      expect(result.errors.budget).toBeDefined();
    });
  });

  describe('guestCount validation', () => {
    it('rejects empty guestCount', () => {
      const result = validateEventForm(validForm({ guestCount: '' }));
      expect(result.errors.guestCount).toBeDefined();
    });

    it('rejects zero guests', () => {
      const result = validateEventForm(validForm({ guestCount: '0' }));
      expect(result.errors.guestCount).toBeDefined();
    });

    it('rejects negative guest count', () => {
      const result = validateEventForm(validForm({ guestCount: '-5' }));
      expect(result.errors.guestCount).toBeDefined();
    });

    it('rejects fractional guest count', () => {
      const result = validateEventForm(validForm({ guestCount: '10.5' }));
      expect(result.errors.guestCount).toBeDefined();
    });

    it('accepts guest count of 1', () => {
      const result = validateEventForm(validForm({ guestCount: '1' }));
      expect(result.errors.guestCount).toBeUndefined();
    });
  });

  describe('eventDate validation', () => {
    it('rejects empty date', () => {
      const result = validateEventForm(validForm({ eventDate: '' }));
      expect(result.errors.eventDate).toBeDefined();
    });

    it('rejects past date', () => {
      const past = '2000-01-01';
      const result = validateEventForm(validForm({ eventDate: past }));
      expect(result.errors.eventDate).toBeDefined();
    });

    it('rejects invalid date string', () => {
      const result = validateEventForm(validForm({ eventDate: 'not-a-date' }));
      expect(result.errors.eventDate).toBeDefined();
    });
  });

  describe('city validation', () => {
    it('rejects empty city', () => {
      const result = validateEventForm(validForm({ city: '' }));
      expect(result.errors.city).toBeDefined();
    });

    it('rejects city over 100 characters', () => {
      const result = validateEventForm(validForm({ city: 'A'.repeat(101) }));
      expect(result.errors.city).toBeDefined();
    });

    it('accepts whitespace-only city as invalid', () => {
      const result = validateEventForm(validForm({ city: '   ' }));
      expect(result.errors.city).toBeDefined();
    });
  });

  describe('theme validation', () => {
    it('rejects empty theme', () => {
      const result = validateEventForm(validForm({ theme: '' }));
      expect(result.errors.theme).toBeDefined();
    });

    it('rejects theme over 200 characters', () => {
      const result = validateEventForm(validForm({ theme: 'x'.repeat(201) }));
      expect(result.errors.theme).toBeDefined();
    });

    it('accepts theme at exactly 200 characters', () => {
      const result = validateEventForm(validForm({ theme: 'x'.repeat(200) }));
      expect(result.errors.theme).toBeUndefined();
    });
  });

  describe('multiple errors', () => {
    it('returns errors for all invalid fields simultaneously', () => {
      const result = validateEventForm({
        eventType: '',
        budget: '',
        guestCount: '',
        eventDate: '',
        city: '',
        theme: '',
      });
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(6);
    });
  });
});

describe('validateField', () => {
  it('returns an error string for invalid field', () => {
    const error = validateField('budget', '-100');
    expect(typeof error).toBe('string');
    expect(error.length).toBeGreaterThan(0);
  });

  it('returns empty string for valid field', () => {
    const error = validateField('city', 'Bengaluru');
    expect(error).toBe('');
  });
});
