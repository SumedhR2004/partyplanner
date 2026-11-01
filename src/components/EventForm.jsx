/**
 * @fileoverview Event setup form component.
 * Validates every field inline; calls onSubmit with clean data.
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { validateEventForm } from '../utils/validation.js';

/** Minimum ISO date string representing today. */
function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

const INITIAL_FORM = {
  eventType: '',
  budget: '',
  guestCount: '',
  eventDate: '',
  city: '',
  theme: '',
};

/**
 * Event setup form with full validation.
 *
 * @param {object}   props
 * @param {Function} props.onSubmit - Called with validated form data object.
 * @returns {JSX.Element}
 */
export default function EventForm({ onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /**
   * Handle field changes and clear the field's error on edit.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} e
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitted) {
      // Re-validate on change after first submit attempt
      const result = validateEventForm({ ...formData, [name]: value });
      setErrors(result.errors);
    }
  }

  /**
   * Handle form submission: validate all fields, call onSubmit if valid.
   * @param {React.FormEvent} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const result = validateEventForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      // Move focus to the first error
      const firstErrorField = Object.keys(result.errors)[0];
      document.getElementById(`field-${firstErrorField}`)?.focus();
      return;
    }
    setErrors({});
    onSubmit({
      ...formData,
      budget: Number(formData.budget),
      guestCount: Number(formData.guestCount),
      eventDate: new Date(formData.eventDate),
    });
  }

  return (
    <section className="glass-card form-section" aria-labelledby="form-heading">
      <h2 id="form-heading" className="section-title">
        <span aria-hidden="true">📋</span> Plan Your Event
      </h2>
      <form onSubmit={handleSubmit} noValidate aria-label="Event setup form">
        {/* Event Type */}
        <div className="field-group">
          <label htmlFor="field-eventType" className="field-label">
            Event Type <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <select
            id="field-eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className={`field-select ${errors.eventType ? 'field-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.eventType ? 'err-eventType' : undefined}
            aria-invalid={!!errors.eventType}
          >
            <option value="">Select event type…</option>
            <option value="wedding">💍 Wedding</option>
            <option value="birthday">🎂 Birthday</option>
            <option value="community">🏘️ Community Event</option>
          </select>
          {errors.eventType && (
            <p id="err-eventType" className="error-message" role="alert" aria-live="polite">
              {errors.eventType}
            </p>
          )}
        </div>

        {/* Budget */}
        <div className="field-group">
          <label htmlFor="field-budget" className="field-label">
            Total Budget (₹) <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <input
            id="field-budget"
            name="budget"
            type="number"
            min="1000"
            step="1000"
            placeholder="e.g. 500000"
            value={formData.budget}
            onChange={handleChange}
            className={`field-input ${errors.budget ? 'field-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.budget ? 'err-budget' : 'hint-budget'}
            aria-invalid={!!errors.budget}
          />
          <p id="hint-budget" className="field-hint">Minimum ₹1,000</p>
          {errors.budget && (
            <p id="err-budget" className="error-message" role="alert" aria-live="polite">
              {errors.budget}
            </p>
          )}
        </div>

        {/* Guest Count */}
        <div className="field-group">
          <label htmlFor="field-guestCount" className="field-label">
            Guest Count <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <input
            id="field-guestCount"
            name="guestCount"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 150"
            value={formData.guestCount}
            onChange={handleChange}
            className={`field-input ${errors.guestCount ? 'field-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.guestCount ? 'err-guestCount' : undefined}
            aria-invalid={!!errors.guestCount}
          />
          {errors.guestCount && (
            <p id="err-guestCount" className="error-message" role="alert" aria-live="polite">
              {errors.guestCount}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div className="field-group">
          <label htmlFor="field-eventDate" className="field-label">
            Event Date <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <input
            id="field-eventDate"
            name="eventDate"
            type="date"
            min={getTodayISO()}
            value={formData.eventDate}
            onChange={handleChange}
            className={`field-input ${errors.eventDate ? 'field-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.eventDate ? 'err-eventDate' : undefined}
            aria-invalid={!!errors.eventDate}
          />
          {errors.eventDate && (
            <p id="err-eventDate" className="error-message" role="alert" aria-live="polite">
              {errors.eventDate}
            </p>
          )}
        </div>

        {/* City */}
        <div className="field-group">
          <label htmlFor="field-city" className="field-label">
            City <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <input
            id="field-city"
            name="city"
            type="text"
            placeholder="e.g. Mumbai"
            maxLength={100}
            value={formData.city}
            onChange={handleChange}
            className={`field-input ${errors.city ? 'field-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.city ? 'err-city' : undefined}
            aria-invalid={!!errors.city}
          />
          {errors.city && (
            <p id="err-city" className="error-message" role="alert" aria-live="polite">
              {errors.city}
            </p>
          )}
        </div>

        {/* Theme */}
        <div className="field-group">
          <label htmlFor="field-theme" className="field-label">
            Theme or Vibe <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <textarea
            id="field-theme"
            name="theme"
            rows={3}
            placeholder="e.g. Rustic bohemian with fairy lights and floral accents"
            maxLength={200}
            value={formData.theme}
            onChange={handleChange}
            className={`field-textarea ${errors.theme ? 'field-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.theme ? 'err-theme' : 'hint-theme'}
            aria-invalid={!!errors.theme}
          />
          <p id="hint-theme" className="field-hint">
            {formData.theme.length}/200 characters
          </p>
          {errors.theme && (
            <p id="err-theme" className="error-message" role="alert" aria-live="polite">
              {errors.theme}
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary" id="btn-generate-plan">
          <span aria-hidden="true">✨</span> Generate My Plan
        </button>
      </form>
    </section>
  );
}

EventForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
