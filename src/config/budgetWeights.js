/**
 * @fileoverview Budget allocation weights per event type.
 *
 * Each event type maps to an object of category → weight (fraction of total budget).
 * Weights within each event type MUST sum to exactly 1.0.
 *
 * Categories: venue, catering, decor, entertainment, photography, attire, contingency.
 */

/**
 * @typedef {Object} BudgetWeights
 * @property {number} venue
 * @property {number} catering
 * @property {number} decor
 * @property {number} entertainment
 * @property {number} photography
 * @property {number} attire
 * @property {number} contingency
 */

/**
 * Budget allocation weights for each supported event type.
 * @type {Record<string, BudgetWeights>}
 */
export const BUDGET_WEIGHTS = {
  wedding: {
    venue: 0.25,
    catering: 0.30,
    decor: 0.15,
    entertainment: 0.08,
    photography: 0.10,
    attire: 0.07,
    contingency: 0.05,
  },
  birthday: {
    venue: 0.20,
    catering: 0.35,
    decor: 0.18,
    entertainment: 0.12,
    photography: 0.08,
    attire: 0.03,
    contingency: 0.04,
  },
  community: {
    venue: 0.30,
    catering: 0.28,
    decor: 0.12,
    entertainment: 0.15,
    photography: 0.05,
    attire: 0.02,
    contingency: 0.08,
  },
};

/**
 * Human-friendly display labels for each budget category.
 * @type {Record<string, string>}
 */
export const CATEGORY_LABELS = {
  venue: 'Venue & Logistics',
  catering: 'Catering & Food',
  decor: 'Décor & Flowers',
  entertainment: 'Entertainment',
  photography: 'Photography & Video',
  attire: 'Attire & Styling',
  contingency: 'Contingency Fund',
};

/**
 * Emoji icons for each budget category.
 * @type {Record<string, string>}
 */
export const CATEGORY_ICONS = {
  venue: '🏛️',
  catering: '🍽️',
  decor: '🌸',
  entertainment: '🎵',
  photography: '📸',
  attire: '👗',
  contingency: '🛡️',
};
