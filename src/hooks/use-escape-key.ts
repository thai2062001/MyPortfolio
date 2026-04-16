import { useEffect } from 'react';

/**
 * Hook that triggers a callback when the Escape key is pressed.
 * 
 * @param onEscape - Callback function to run when Escape is pressed.
 * @param active - Boolean to enable/disable the listener.
 */
export const useEscapeKey = (onEscape: () => void, active: boolean = true) => {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, active]);
};
