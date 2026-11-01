/**
 * @fileoverview App header with skip-to-content link and branding.
 */

import PropTypes from 'prop-types';

/**
 * Application header component.
 *
 * @param {object} props
 * @param {boolean} [props.hasPlan] - Whether a plan has been generated (to show nav hint).
 * @returns {JSX.Element}
 */
export default function Header({ hasPlan }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="app-header" role="banner">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-logo" aria-hidden="true">🎉</span>
            <div className="header-title-group">
              <h1 className="header-title">PartyPilot</h1>
              <p className="header-tagline">Your GenAI-powered celebration planner</p>
            </div>
          </div>
          {hasPlan && (
            <nav className="header-nav" aria-label="Plan sections">
              <a href="#budget-section" className="nav-link">Budget</a>
              <a href="#timeline-section" className="nav-link">Timeline</a>
              <a href="#checklist-section" className="nav-link">Checklist</a>
              <a href="#ideas-section" className="nav-link">Ideas</a>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

Header.propTypes = {
  hasPlan: PropTypes.bool,
};

Header.defaultProps = {
  hasPlan: false,
};
