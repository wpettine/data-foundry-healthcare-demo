import { useEffect } from 'react';
import { resetAllStores } from '../store/resetDemo';

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Ctrl+Shift+R — reset all stores
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        resetAllStores();
        window.location.href = '/';
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
