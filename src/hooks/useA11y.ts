import { useRef, useCallback, useEffect } from 'react';

interface UseA11yOptions {
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  onEscape?: () => void;
}

export function useA11y({
  trapFocus = false,
  autoFocus = false,
  restoreFocus = false,
  onEscape,
}: UseA11yOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the last focused element before opening the modal/dialog
  useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    return () => {
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [restoreFocus]);

  // Auto focus the first focusable element
  useEffect(() => {
    if (autoFocus && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [autoFocus]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (!trapFocus) return;

      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements[0] as HTMLElement;
      const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    },
    [trapFocus, onEscape]
  );

  useEffect(() => {
    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [trapFocus, handleKeyDown]);

  return {
    containerRef,
    role: 'dialog',
    'aria-modal': trapFocus ? true : undefined,
    tabIndex: -1,
  };
} 