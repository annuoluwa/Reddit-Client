import React, { useState } from 'react';
import styles from './KeyboardShortcuts.module.css';

const KeyboardShortcuts = () => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcuts = [
    { key: '/', description: 'Focus search' },
    { key: 'R', description: 'Refresh posts' },
    { key: 'T', description: 'Toggle theme' },
    { key: 'ESC', description: 'Close/Blur' },
    { key: '?', description: 'Show shortcuts' },
  ];

  return (
    <>
      <button 
        className={styles.helpButton}
        onClick={() => setIsVisible(!isVisible)}
        title="Keyboard shortcuts"
        aria-label="Show keyboard shortcuts"
      >
        ?
      </button>
      
      {isVisible && (
        <div className={styles.modal} onClick={() => setIsVisible(false)}>
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
            <h3>Keyboard Shortcuts</h3>
            <div className={styles.shortcuts}>
              {shortcuts.map(({ key, description }) => (
                <div key={key} className={styles.shortcut}>
                  <kbd className={styles.key}>{key}</kbd>
                  <span className={styles.description}>{description}</span>
                </div>
              ))}
            </div>
            <button className={styles.closeBtn} onClick={() => setIsVisible(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;
