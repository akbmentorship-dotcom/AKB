import { useState, useCallback } from 'react';
import { storageGet, storageSet } from '../lib/storage.js';

export function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => storageGet(key, initialValue));

  const setValue = useCallback((value) => {
    setState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      storageSet(key, next);
      return next;
    });
  }, [key]);

  return [state, setValue];
}
