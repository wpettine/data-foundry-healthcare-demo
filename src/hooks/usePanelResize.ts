import { useState, useCallback } from 'react';

export function usePanelResize(key: string, defaultSizes: number[]) {
  const storageKey = `panel-sizes-${key}`;

  const [sizes] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return defaultSizes;
  });

  const onLayout = useCallback(
    (newSizes: number[]) => {
      localStorage.setItem(storageKey, JSON.stringify(newSizes));
    },
    [storageKey]
  );

  return { sizes, onLayout };
}
