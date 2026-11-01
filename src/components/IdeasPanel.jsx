/**
 * @fileoverview AI-powered ideas panel.
 * Calls /api/ideas, shows loading/error/fallback states.
 * Never uses dangerouslySetInnerHTML.
 */

import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getFallbackIdeas } from '../utils/fallbackIdeas.js';

/** Category icon map for idea cards. */
const IDEA_ICONS = {
  'Decor': '🌸',
  'Food & Drinks': '🍽️',
  'Activities': '🎯',
  'Budget-Saving Tips': '💡',
  'Local Experience': '📍',
};

/**
 * @typedef {'idle'|'loading'|'success'|'fallback'|'error'} IdeasStatus
 */

/**
 * AI Ideas Panel component.
 *
 * @param {object} props
 * @param {string} props.eventType  - Event type for ideas.
 * @param {string} props.theme      - Theme/vibe string.
 * @param {string} props.city       - City name.
 * @param {number} props.budget     - Total budget in INR.
 * @param {number} props.guestCount - Number of guests.
 * @returns {JSX.Element}
 */
export default function IdeasPanel({ eventType, theme, city, budget, guestCount }) {
  /** @type {[IdeasStatus, Function]} */
  const [status, setStatus] = useState('idle');
  const [ideas, setIdeas] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Fetch personalised ideas from /api/ideas.
   * Falls back to local templates on any error.
   */
  const fetchIdeas = useCallback(async () => {
    setStatus('loading');
    setIdeas([]);
    setErrorMsg('');

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, theme, city, budget, guestCount }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.ideas) || data.ideas.length === 0) {
        throw new Error('Invalid response format');
      }

      setIdeas(data.ideas);
      setStatus('success');
    } catch (err) {
      // Always fall back gracefully — never show a broken screen
      const fallback = getFallbackIdeas(eventType);
      setIdeas(fallback);
      setStatus('fallback');
      setErrorMsg(
        err.name === 'AbortError'
          ? 'Request timed out — showing curated ideas.'
          : 'AI service unavailable — showing curated ideas.'
      );
    }
  }, [eventType, theme, city, budget, guestCount]);

  return (
    <section
      id="ideas-section"
      className="glass-card"
      aria-labelledby="ideas-heading"
    >
      <h2 id="ideas-heading" className="section-title">
        <span aria-hidden="true">🤖</span> Personalised Ideas
      </h2>

      {status === 'idle' && (
        <div className="ideas-idle">
          <p className="ideas-prompt-text">
            Get AI-generated ideas tailored to your event type, theme, city, and budget.
          </p>
          <button
            id="btn-get-ideas"
            className="btn-primary btn-ideas"
            onClick={fetchIdeas}
            aria-label="Get personalised event ideas powered by AI"
          >
            <span aria-hidden="true">✨</span> Get Personalised Ideas
          </button>
        </div>
      )}

      {status === 'loading' && (
        <div
          className="ideas-loading"
          aria-live="polite"
          aria-busy="true"
          aria-label="Generating personalised ideas, please wait"
        >
          <div className="spinner" aria-hidden="true" />
          <p className="loading-text">Crafting personalised ideas for you…</p>
        </div>
      )}

      {status === 'fallback' && (
        <div
          className="offline-notice"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">📡</span>{' '}
          <strong>Offline ideas mode</strong> — {errorMsg}
        </div>
      )}

      {(status === 'success' || status === 'fallback') && ideas.length > 0 && (
        <>
          <div
            className="ideas-grid"
            aria-live="polite"
            aria-label="Event ideas"
          >
            {ideas.map((idea, idx) => (
              <article key={idx} className="idea-card">
                <div className="idea-card-header">
                  <span className="idea-icon" aria-hidden="true">
                    {IDEA_ICONS[idea.category] || '💫'}
                  </span>
                  <div>
                    <p className="idea-category">{idea.category}</p>
                    <h3 className="idea-title">{idea.title}</h3>
                  </div>
                </div>
                <p className="idea-description">{idea.description}</p>
              </article>
            ))}
          </div>
          <button
            className="btn-secondary btn-refresh"
            onClick={fetchIdeas}
            aria-label="Regenerate ideas"
          >
            <span aria-hidden="true">🔄</span> Regenerate Ideas
          </button>
        </>
      )}

      {status === 'error' && (
        <div className="error-state" role="alert" aria-live="assertive">
          <p>{errorMsg}</p>
          <button className="btn-secondary" onClick={fetchIdeas}>
            Try Again
          </button>
        </div>
      )}
    </section>
  );
}

IdeasPanel.propTypes = {
  eventType: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  guestCount: PropTypes.number.isRequired,
};
