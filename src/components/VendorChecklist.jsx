/**
 * @fileoverview Vendor checklist component.
 * Persists checked state in localStorage per event type.
 * Supports custom items and shows a progress bar.
 */

import { useState, useMemo, useId } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { VENDOR_TEMPLATES } from '../config/vendorTemplates.js';

/**
 * Build the storage key for checked-items state.
 * @param {string} eventType
 * @returns {string}
 */
function storageKey(eventType) {
  return `partypilot_checklist_${eventType}`;
}

/**
 * Build the storage key for custom items.
 * @param {string} eventType
 * @returns {string}
 */
function customItemsKey(eventType) {
  return `partypilot_custom_${eventType}`;
}

/**
 * Vendor checklist with progress bar and custom items.
 *
 * @param {object} props
 * @param {string} props.eventType - 'wedding' | 'birthday' | 'community'
 * @returns {JSX.Element}
 */
export default function VendorChecklist({ eventType }) {
  const templateItems = VENDOR_TEMPLATES[eventType] || [];

  const [checkedIds, setCheckedIds] = useLocalStorage(storageKey(eventType), {});
  const [customItems, setCustomItems] = useLocalStorage(customItemsKey(eventType), []);
  const [newItemText, setNewItemText] = useState('');
  const [addError, setAddError] = useState('');

  const uid = useId();

  const allItems = useMemo(
    () => [...templateItems, ...customItems],
    [templateItems, customItems]
  );

  const checkedCount = useMemo(
    () => allItems.filter((item) => checkedIds[item.id]).length,
    [allItems, checkedIds]
  );

  const progressPercent = allItems.length > 0
    ? Math.round((checkedCount / allItems.length) * 100)
    : 0;

  /**
   * Toggle a checklist item's checked state.
   * @param {string} id
   */
  function toggleItem(id) {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  /**
   * Add a new custom item to the checklist.
   * @param {React.FormEvent} e
   */
  function handleAddItem(e) {
    e.preventDefault();
    const label = newItemText.trim();
    if (!label) {
      setAddError('Please enter an item description.');
      return;
    }
    if (label.length > 120) {
      setAddError('Item description must be under 120 characters.');
      return;
    }
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setCustomItems((prev) => [...prev, { id, label, group: 'Custom' }]);
    setNewItemText('');
    setAddError('');
  }

  // Group items by their group field
  const groups = useMemo(() => {
    const map = new Map();
    allItems.forEach((item) => {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group).push(item);
    });
    return map;
  }, [allItems]);

  return (
    <section
      id="checklist-section"
      className="glass-card"
      aria-labelledby="checklist-heading"
    >
      <h2 id="checklist-heading" className="section-title">
        <span aria-hidden="true">✅</span> Vendor Checklist
      </h2>

      {/* Progress bar */}
      <div className="progress-container" aria-label={`${checkedCount} of ${allItems.length} tasks completed`}>
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-count" aria-live="polite">
            {checkedCount} / {allItems.length} done ({progressPercent}%)
          </span>
        </div>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Checklist completion"
        >
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grouped checklist */}
      {[...groups.entries()].map(([group, items]) => (
        <div key={group} className="checklist-group">
          <h3 className="checklist-group-label">{group}</h3>
          <ul className="checklist-list" aria-label={`${group} tasks`}>
            {items.map((item) => (
              <li key={item.id} className="checklist-item">
                <label className="checklist-label" htmlFor={`${uid}-${item.id}`}>
                  <input
                    id={`${uid}-${item.id}`}
                    type="checkbox"
                    className="checklist-checkbox"
                    checked={!!checkedIds[item.id]}
                    onChange={() => toggleItem(item.id)}
                    aria-label={item.label}
                  />
                  <span className={`checklist-text ${checkedIds[item.id] ? 'checklist-done' : ''}`}>
                    {item.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Add custom item */}
      <form
        className="add-item-form"
        onSubmit={handleAddItem}
        aria-label="Add custom checklist item"
      >
        <div className="add-item-row">
          <label htmlFor={`${uid}-new-item`} className="sr-only">
            New checklist item
          </label>
          <input
            id={`${uid}-new-item`}
            type="text"
            className="field-input add-item-input"
            placeholder="Add custom item…"
            value={newItemText}
            onChange={(e) => {
              setNewItemText(e.target.value);
              setAddError('');
            }}
            maxLength={120}
            aria-describedby={addError ? `${uid}-add-error` : undefined}
            aria-invalid={!!addError}
          />
          <button
            type="submit"
            className="btn-secondary"
            aria-label="Add item to checklist"
          >
            + Add
          </button>
        </div>
        {addError && (
          <p
            id={`${uid}-add-error`}
            className="error-message"
            role="alert"
            aria-live="polite"
          >
            {addError}
          </p>
        )}
      </form>
    </section>
  );
}

VendorChecklist.propTypes = {
  eventType: PropTypes.string.isRequired,
};
