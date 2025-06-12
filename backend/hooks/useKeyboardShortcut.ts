import { useEffect, useCallback } from 'react';

type KeyCombo = string | string[];
type Handler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export function useKeyboardShortcut(
  keyCombo: KeyCombo,
  handler: Handler,
  options: ShortcutOptions = {}
) {
  const { ctrl = false, shift = false, alt = false, meta = false } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const keys = Array.isArray(keyCombo) ? keyCombo : [keyCombo];
      const key = event.key.toLowerCase();

      if (!keys.includes(key)) {
        return;
      }

      if (
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt &&
        event.metaKey === meta
      ) {
        handler(event);
      }
    },
    [keyCombo, handler, ctrl, shift, alt, meta]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Example usage:
// useKeyboardShortcut('s', (e) => {
//   e.preventDefault();
//   console.log('Save!');
// }, { ctrl: true });
//
// useKeyboardShortcut(['ArrowLeft', 'ArrowRight'], (e) => {
//   console.log('Navigation!');
// }); 