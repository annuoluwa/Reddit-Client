import React from 'react';
import styles from './EmptyState.module.css';

function EmptyState({ message = "No posts found", showIcon = true }) {
  return (
    <div className={styles.emptyState}>
      {showIcon && (
        <div className={styles.icon}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" stroke="#374151" strokeWidth="4" fill="none"/>
            <path d="M40 55 Q60 35, 80 55" stroke="#374151" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="45" cy="50" r="5" fill="#374151"/>
            <circle cx="75" cy="50" r="5" fill="#374151"/>
            <path d="M40 75 Q60 85, 80 75" stroke="#374151" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      <p className={styles.message}>{message}</p>
      <p className={styles.hint}>Try adjusting your search or selecting a different subreddit</p>
    </div>
  );
}

export default EmptyState;
