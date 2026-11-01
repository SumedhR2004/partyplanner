/**
 * @fileoverview Custom React hook for localStorage persistence.
 * Wraps useState with safe localStorage read/write.
 * All storage calls are wrapped in try/catch so the app
 * works even when localStorage is blocked (e.g. private browsing).
 */

import { useState } from 'react';

/**
 * A useState-compatible hook that persists state in localStorage.
 *
 * @template T
 * @param {string} key            - localStorage key.
 * @param {T}      initialValue   - Default value if key is absent or unreadable.
 * @returns {[T, Function]}       - [storedValue, setValue] tuple.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  /**
   * Update state and persist to localStorage.
   * Accepts either a new value or an updater function (same API as useState).
   *
   * @param {T | ((prev: T) => T)} valueOrUpdater
   */
  const setValue = (valueOrUpdater) => {
    try {
      setStoredValue((prev) => {
        const next =
          typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
        window.localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    } catch {
      // Storage write failed — update state only (app still works)
      setStoredValue(valueOrUpdater);
    }
  };

  return [storedValue, setValue];
}
