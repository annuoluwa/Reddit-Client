import React, { useState, useEffect } from 'react';
import styles from './LoadingBar.module.css';

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleFetchStart = () => {
      setIsLoading(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    };

    const handleFetchEnd = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 400);
    };

    window.addEventListener('fetch-start', handleFetchStart);
    window.addEventListener('fetch-end', handleFetchEnd);

    return () => {
      window.removeEventListener('fetch-start', handleFetchStart);
      window.removeEventListener('fetch-end', handleFetchEnd);
    };
  }, []);

  if (!isLoading && progress === 0) return null;

  return (
    <div className={styles.loadingBar}>
      <div 
        className={styles.progress} 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar;
