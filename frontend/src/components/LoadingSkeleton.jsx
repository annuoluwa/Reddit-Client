import React from 'react';
import styles from './LoadingSkeleton.module.css';

function LoadingSkeleton({ count = 3 }) {
  return (
    <>
      {[...new Array(count)].map((_, i) => (
        <div key={`skeleton-${i}`} className={styles.skeletonCard}>
          <div className={styles.skeletonVote}>
            <div className={styles.skeletonCircle}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonCircle}></div>
          </div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonTitleShort}></div>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonMeta}>
              <div className={styles.skeletonMetaItem}></div>
              <div className={styles.skeletonMetaItem}></div>
              <div className={styles.skeletonMetaItem}></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default LoadingSkeleton;
