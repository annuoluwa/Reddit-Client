import React from 'react';
import styles from './ImageModal.module.css';

function ImageModal({ imageUrl, onClose, title }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className={styles.modalBackdrop} 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <img src={imageUrl} alt={title || "Post image"} className={styles.modalImage} />
        {title && <p className={styles.imageTitle}>{title}</p>}
      </div>
    </div>
  );
}

export default ImageModal;
