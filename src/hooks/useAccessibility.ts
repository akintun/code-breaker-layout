import { useEffect, useCallback, useRef } from "react";

interface UseAccessibilityOptions {
  announceChanges?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const { announceChanges = true, trapFocus = false, restoreFocus = true } = options;
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const announceRef = useRef<HTMLDivElement | null>(null);

  // Create screen reader announcement region
  useEffect(() => {
    if (!announceChanges) return;

    const announceRegion = document.createElement('div');
    announceRegion.setAttribute('aria-live', 'polite');
    announceRegion.setAttribute('aria-atomic', 'true');
    announceRegion.setAttribute('class', 'sr-only');
    announceRegion.style.position = 'absolute';
    announceRegion.style.left = '-10000px';
    announceRegion.style.width = '1px';
    announceRegion.style.height = '1px';
    announceRegion.style.overflow = 'hidden';
    
    document.body.appendChild(announceRegion);
    announceRef.current = announceRegion;

    return () => {
      if (announceRef.current && document.body.contains(announceRef.current)) {
        document.body.removeChild(announceRef.current);
      }
    };
  }, [announceChanges]);

  // Announce messages to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceRef.current) return;

    announceRef.current.setAttribute('aria-live', priority);
    announceRef.current.textContent = message;

    // Clear after a short delay to allow re-announcement of same message
    setTimeout(() => {
      if (announceRef.current) {
        announceRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  // Save current focus for restoration
  const saveFocus = useCallback(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [restoreFocus]);

  // Restore previously saved focus
  const restorePreviousFocus = useCallback(() => {
    if (restoreFocus && previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [restoreFocus]);

  // Focus trap for modals
  const trapFocusInElement = useCallback((element: HTMLElement) => {
    if (!trapFocus) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [trapFocus]);

  // Keyboard navigation helper
  const handleArrowKeys = useCallback((
    e: KeyboardEvent,
    items: NodeListOf<HTMLElement> | HTMLElement[],
    currentIndex: number,
    onSelect?: (index: number) => void
  ) => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % items.length;
        e.preventDefault();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = items.length - 1;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        if (onSelect) {
          onSelect(currentIndex);
          e.preventDefault();
        }
        break;
      default:
        return;
    }

    const targetElement = items[newIndex];
    if (targetElement) {
      targetElement.focus();
    }
  }, []);

  return {
    announce,
    saveFocus,
    restorePreviousFocus,
    trapFocusInElement,
    handleArrowKeys,
  };
};