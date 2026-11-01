/**
 * @fileoverview Budget breakdown display component.
 * Memoised — only re-renders when event data changes.
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { allocateBudget, formatINR } from '../utils/budget.js';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../config/budgetWeights.js';

/**
 * Displays an itemised budget breakdown for an event.
 *
 * @param {object} props
 * @param {string} props.eventType  - 'wedding' | 'birthday' | 'community'
 * @param {number} props.budget     - Total budget in INR.
 * @param {number} props.guestCount - Number of guests.
 * @returns {JSX.Element}
 */
export default function BudgetBreakdown({ eventType, budget, guestCount }) {
  const lineItems = useMemo(
    () => allocateBudget(eventType, budget, guestCount),
    [eventType, budget, guestCount]
  );

  return (
    <section
      id="budget-section"
      className="glass-card"
      aria-labelledby="budget-heading"
    >
      <h2 id="budget-heading" className="section-title">
        <span aria-hidden="true">💰</span> Budget Breakdown
      </h2>
      <p className="section-subtitle">
        Total: <strong>{formatINR(budget)}</strong> for{' '}
        <strong>{guestCount.toLocaleString('en-IN')}</strong> guests
      </p>

      <div className="budget-grid" role="list" aria-label="Budget category list">
        {lineItems.map(({ category, amount, percentage, perGuest }) => (
          <article
            key={category}
            className="budget-card"
            role="listitem"
          >
            <div className="budget-card-header">
              <span className="budget-icon" aria-hidden="true">
                {CATEGORY_ICONS[category]}
              </span>
              <h3 className="budget-category">
                {CATEGORY_LABELS[category] || category}
              </h3>
            </div>
            <p className="budget-amount">{formatINR(amount)}</p>
            <div className="budget-bar-wrapper" aria-hidden="true">
              <div
                className="budget-bar-fill"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="budget-meta">
              <span className="budget-pct">{percentage}%</span>
              <span className="budget-per-guest">
                {formatINR(perGuest)}/guest
              </span>
            </div>
          </article>
        ))}
      </div>

      <p className="budget-disclaimer">
        <span aria-hidden="true">ℹ️</span>{' '}
        Allocations are indicative. Adjust in your actual plan as needed.
      </p>
    </section>
  );
}

BudgetBreakdown.propTypes = {
  eventType: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  guestCount: PropTypes.number.isRequired,
};
