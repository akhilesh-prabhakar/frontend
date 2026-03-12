// ─────────────────────────────────────────────────────────────────────────────
// useLocalStorage.ts
// Generic, type-safe hook for reading and writing to localStorage.
//
// Design decisions:
//  - Initialiser lazily reads from localStorage so it never blocks render.
//  - Accepts a fallback value used when the key is absent or JSON is malformed.
//  - Exposes a `remove` helper so callers can clear a key without coupling to
//    the raw localStorage API.
//  - All serialisation/deserialisation errors are caught silently; the hook
//    degrades gracefully to the fallback value.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';

interface UseLocalStorageReturn<T> {
  storedValue: T;
  setValue:    (value: T) => void;
  remove:      () => void;
}

export function useLocalStorage<T>(
  key:      string,
  fallback: T,
): UseLocalStorageReturn<T> {
  // Lazy initialiser — runs once on mount, never on re-render
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return fallback;   // SSR guard
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`useLocalStorage: failed to write key "${key}"`, error);
      }
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      setStoredValue(fallback);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`useLocalStorage: failed to remove key "${key}"`, error);
    }
  }, [key, fallback]);

  return { storedValue, setValue, remove };
}
