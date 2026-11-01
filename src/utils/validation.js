/**
 * @fileoverview Pure form validation utilities.
 * No React imports. Fully unit-testable.
 */

/** Minimum budget in INR. */
const MIN_BUDGET = 1000;

/** Minimum guest count. */
const MIN_GUESTS = 1;

/** Maximum guest count (sanity cap). */
const MAX_GUESTS = 100_000;

/** Maximum theme length in characters. */
const MAX_THEME_LENGTH = 200;

/** Maximum city length in characters. */
const MAX_CITY_LENGTH = 100;

/** Supported event types. */
export const VALID_EVENT_TYPES = ['wedding', 'birthday', 'community'];

/**
 * @typedef {Object} ValidationResult
 * @property {boolean}              isValid - True if all fields are valid.
 * @property {Record<string, string>} errors  - Field-name → error message map.
 */

/**
 * Validate the event setup form data.
 *
 * Rules:
 *  - eventType: must be one of 'wedding', 'birthday', 'community'.
 *  - budget: must be a finite number ≥ MIN_BUDGET.
 *  - guestCount: must be a positive integer in [MIN_GUESTS, MAX_GUESTS].
 *  - eventDate: must be a non-empty string representing a future date.
 *  - city: must be a non-empty string (max MAX_CITY_LENGTH chars).
 *  - theme: must be a non-empty string (max MAX_THEME_LENGTH chars).
 *
 * @param {Record<string, unknown>} formData - Raw form field values.
 * @returns {ValidationResult}
 */
export function validateEventForm(formData) {
  const errors = {};

  // eventType
  if (!formData.eventType || !VALID_EVENT_TYPES.includes(formData.eventType)) {
    errors.eventType = 'Please select a valid event type.';
  }

  // budget
  const budgetNum = Number(formData.budget);
  if (formData.budget === '' || formData.budget === null || formData.budget === undefined) {
    errors.budget = 'Budget is required.';
  } else if (!Number.isFinite(budgetNum)) {
    errors.budget = 'Budget must be a valid number.';
  } else if (budgetNum < MIN_BUDGET) {
    errors.budget = `Budget must be at least ₹${MIN_BUDGET.toLocaleString('en-IN')}.`;
  }

  // guestCount
  const guestNum = Number(formData.guestCount);
  if (formData.guestCount === '' || formData.guestCount === null || formData.guestCount === undefined) {
    errors.guestCount = 'Guest count is required.';
  } else if (!Number.isInteger(guestNum)) {
    errors.guestCount = 'Guest count must be a whole number.';
  } else if (guestNum < MIN_GUESTS) {
    errors.guestCount = `Guest count must be at least ${MIN_GUESTS}.`;
  } else if (guestNum > MAX_GUESTS) {
    errors.guestCount = `Guest count cannot exceed ${MAX_GUESTS.toLocaleString('en-IN')}.`;
  }

  // eventDate
  if (!formData.eventDate) {
    errors.eventDate = 'Event date is required.';
  } else {
    const date = new Date(formData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(date.getTime())) {
      errors.eventDate = 'Please enter a valid date.';
    } else if (date < today) {
      errors.eventDate = 'Event date must be today or in the future.';
    }
  }

  // city
  const city = String(formData.city || '').trim();
  if (city.length === 0) {
    errors.city = 'City is required.';
  } else if (city.length > MAX_CITY_LENGTH) {
    errors.city = `City name must be under ${MAX_CITY_LENGTH} characters.`;
  }

  // theme
  const theme = String(formData.theme || '').trim();
  if (theme.length === 0) {
    errors.theme = 'Theme or vibe description is required.';
  } else if (theme.length > MAX_THEME_LENGTH) {
    errors.theme = `Theme description must be under ${MAX_THEME_LENGTH} characters.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate a single field value (for real-time inline validation).
 *
 * @param {string}  fieldName  - The form field name.
 * @param {unknown} value      - The field value.
 * @returns {string} Error message, or empty string if valid.
 */
export function validateField(fieldName, value) {
  const result = validateEventForm({ [fieldName]: value });
  return result.errors[fieldName] || '';
}
