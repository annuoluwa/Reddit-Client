import { useEffect } from 'react';

export const useKeyboardShortcuts = (callbacks) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'j':
          callbacks.onNextPost?.();
          break;
        case 'k':
          callbacks.onPrevPost?.();
          break;
        case '/':
          e.preventDefault();
          callbacks.onFocusSearch?.();
          break;
        case 'escape':
          callbacks.onEscape?.();
          break;
        case 'r':
          if (e.metaKey || e.ctrlKey) return;
          callbacks.onRefresh?.();
          break;
        case 't':
          callbacks.onToggleTheme?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [callbacks]);
};
