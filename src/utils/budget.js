/**
 * @fileoverview Pure budget allocation utilities.
 * No React imports. Fully unit-testable.
 */

import { BUDGET_WEIGHTS } from '../config/budgetWeights.js';

/**
 * @typedef {Object} BudgetLineItem
 * @property {string} category    - Category key (e.g. 'venue').
 * @property {number} amount      - Allocated amount in INR.
 * @property {number} percentage  - Percentage of total budget (0–100).
 * @property {number} perGuest    - Per-guest cost in INR.
 */

/**
 * Validate that a budget value is a positive finite number.
 *
 * @param {unknown} budget - Raw budget input.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateBudget(budget) {
  const num = Number(budget);
  if (!Number.isFinite(num)) {
    return { valid: false, error: 'Budget must be a number.' };
  }
  if (num <= 0) {
    return { valid: false, error: 'Budget must be greater than zero.' };
  }
  return { valid: true };
}

/**
 * Validate that a guest count is a positive integer.
 *
 * @param {unknown} guestCount - Raw guest count input.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateGuestCount(guestCount) {
  const num = Number(guestCount);
  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Guest count must be a whole number.' };
  }
  if (num <= 0) {
    return { valid: false, error: 'Guest count must be at least 1.' };
  }
  return { valid: true };
}

/**
 * Allocate a total budget across categories for a given event type.
 * Uses the weight configuration in budgetWeights.js.
 *
 * @param {string} eventType  - One of 'wedding', 'birthday', 'community'.
 * @param {number} budget     - Total budget in INR (must be > 0).
 * @param {number} guestCount - Number of guests (must be >= 1).
 * @returns {BudgetLineItem[]} Array of line items sorted by allocation amount descending.
 * @throws {Error} If eventType is not supported, budget ≤ 0, or guestCount < 1.
 */
export function allocateBudget(eventType, budget, guestCount) {
  const budgetNum = Number(budget);
  const guestNum = Number(guestCount);

  if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
    throw new Error('Budget must be a positive number.');
  }

  if (!Number.isInteger(guestNum) || guestNum < 1) {
    throw new Error('Guest count must be a positive integer.');
  }

  const weights = BUDGET_WEIGHTS[eventType];
  if (!weights) {
    throw new Error(`Unsupported event type: "${eventType}".`);
  }

  return Object.entries(weights)
    .map(([category, weight]) => {
      const amount = Math.round(budgetNum * weight);
      const percentage = Math.round(weight * 100);
      const perGuest = Math.round(amount / guestNum);
      return { category, amount, percentage, perGuest };
    })
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Format a number as Indian Rupees (₹ with comma grouping).
 *
 * @param {number} amount - Amount in INR.
 * @returns {string} Formatted currency string (e.g. "₹1,25,000").
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
