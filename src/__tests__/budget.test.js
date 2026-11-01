import { describe, it, expect } from 'vitest';
import { allocateBudget, validateBudget, validateGuestCount, formatINR } from '../utils/budget.js';
import { BUDGET_WEIGHTS } from '../config/budgetWeights.js';

describe('validateBudget', () => {
  it('returns valid for a positive number', () => {
    expect(validateBudget(100000).valid).toBe(true);
  });

  it('rejects zero budget', () => {
    const result = validateBudget(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects negative budget', () => {
    const result = validateBudget(-5000);
    expect(result.valid).toBe(false);
  });

  it('rejects non-numeric budget', () => {
    const result = validateBudget('abc');
    expect(result.valid).toBe(false);
  });

  it('rejects NaN', () => {
    expect(validateBudget(NaN).valid).toBe(false);
  });
});

describe('validateGuestCount', () => {
  it('returns valid for a positive integer', () => {
    expect(validateGuestCount(50).valid).toBe(true);
  });

  it('rejects zero guests', () => {
    expect(validateGuestCount(0).valid).toBe(false);
  });

  it('rejects negative guests', () => {
    expect(validateGuestCount(-1).valid).toBe(false);
  });

  it('rejects fractional guest count', () => {
    expect(validateGuestCount(1.5).valid).toBe(false);
  });
});

describe('allocateBudget', () => {
  const EVENT_TYPES = ['wedding', 'birthday', 'community'];

  EVENT_TYPES.forEach((eventType) => {
    describe(`event type: ${eventType}`, () => {
      it('has a valid weight configuration (weights exist)', () => {
        expect(BUDGET_WEIGHTS[eventType]).toBeDefined();
      });

      it('weights sum to approximately 1.0', () => {
        const total = Object.values(BUDGET_WEIGHTS[eventType]).reduce((s, w) => s + w, 0);
        expect(total).toBeCloseTo(1.0, 5);
      });

      it('allocations sum to the total budget', () => {
        const budget = 500_000;
        const items = allocateBudget(eventType, budget, 100);
        const summed = items.reduce((s, item) => s + item.amount, 0);
        // Allow ±1 rupee rounding difference across categories
        expect(Math.abs(summed - budget)).toBeLessThanOrEqual(items.length);
      });

      it('per-guest cost is correct for each category', () => {
        const budget = 300_000;
        const guests = 60;
        const items = allocateBudget(eventType, budget, guests);
        items.forEach(({ amount, perGuest }) => {
          expect(perGuest).toBe(Math.round(amount / guests));
        });
      });

      it('returns items sorted by amount descending', () => {
        const items = allocateBudget(eventType, 400_000, 80);
        for (let i = 0; i < items.length - 1; i++) {
          expect(items[i].amount).toBeGreaterThanOrEqual(items[i + 1].amount);
        }
      });
    });
  });

  it('throws on unsupported event type', () => {
    expect(() => allocateBudget('gala', 100_000, 50)).toThrow();
  });

  it('throws on zero budget', () => {
    expect(() => allocateBudget('wedding', 0, 50)).toThrow();
  });

  it('throws on negative budget', () => {
    expect(() => allocateBudget('wedding', -1000, 50)).toThrow();
  });

  it('throws on zero guests', () => {
    expect(() => allocateBudget('wedding', 100_000, 0)).toThrow();
  });

  it('all percentages are non-negative integers', () => {
    const items = allocateBudget('birthday', 200_000, 30);
    items.forEach(({ percentage }) => {
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(percentage)).toBe(true);
    });
  });
});

describe('formatINR', () => {
  it('formats amounts with ₹ symbol', () => {
    const formatted = formatINR(100_000);
    expect(formatted).toContain('₹');
  });

  it('formats zero without decimals', () => {
    const formatted = formatINR(0);
    expect(formatted).not.toContain('.');
  });
});
