 import React, { useState } from "react";
 import { Link } from "react-router-dom";
import styles from './post.module.css';
import ImageModal from '../../components/ImageModal';
import { useToast } from '../../context/ToastContext';
import { useBookmarks } from '../../hooks/useBookmarks';

const getRelativeTime = (timestamp) => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
};

 function Post({post}){
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  if (!post) return null;
  
const {
  id,
  title,
  author,
  subreddit,
  thumbnail,
  score,
  num_comments,
  created_utc,
  permalink,
} = post;

  const invalidThumbValues = ['self', 'default', 'nsfw', 'image', ''];

  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (invalidThumbValues.includes(url)) return false;
    return (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('//')
    );
  };

  const imageUrl = isValidImageUrl(thumbnail)
    ? (thumbnail.startsWith('//') ? 'https:' + thumbnail : thumbnail)
    : process.env.PUBLIC_URL + '/no-image.png';

  const handleShare = (e) => {
    e.preventDefault();
    const url = `https://reddit.com${permalink}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  const handleImageClick = (e) => {
    e.preventDefault();
    if (isValidImageUrl(thumbnail) && !invalidThumbValues.includes(thumbnail)) {
      setShowModal(true);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    toggleBookmark(post);
    toast.success(isBookmarked(post.id) ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  return (
    <>
      {showModal && (
        <ImageModal 
          imageUrl={imageUrl}
          title={title}
          onClose={() => setShowModal(false)}
        />
      )}
      
      <div className={styles.postCard}>
        <div className={styles.voteSection}>
          <button className={styles.voteBtn} aria-label="Upvote">⬆️</button>
          <span className={styles.voteScore}>{score > 1000 ? `${(score/1000).toFixed(1)}k` : score}</span>
          <button className={styles.voteBtn} aria-label="Downvote">⬇️</button>
        </div>
        
        <div className={styles.contentSection}>
          <Link to={`/post/${id}`} state={{subreddit}} className={styles.postLink}>
            <h3 className={styles.postTitle}>{title}</h3>
            
            {imageUrl && (
              <img 
                className={styles.postImage}
                src={imageUrl}
                alt="Post thumbnail"
                onClick={handleImageClick}
                style={{ cursor: isValidImageUrl(thumbnail) ? 'pointer' : 'default' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = process.env.PUBLIC_URL + '/no-image.png';
                }}
              />
            )}
          </Link>
          
          <div className={styles.metaInfo}>
            <span className={styles.metaItem}>👤 u/{author}</span>
            <span className={styles.metaItem}>📁 r/{subreddit}</span>
            <span className={styles.metaItem}>🕒 {getRelativeTime(created_utc)}</span>
          </div>
          
          <div className={styles.actions}>
            <button 
              onClick={handleBookmark} 
              className={`${styles.actionBtn} ${isBookmarked(id) ? styles.bookmarked : ''}`}
              title={isBookmarked(id) ? 'Remove bookmark' : 'Bookmark post'}
            >
              {isBookmarked(id) ? '🔖 Saved' : '📌 Save'}
            </button>
            <Link to={`/post/${id}`} state={{subreddit}} className={styles.actionBtn}>
              💬 {num_comments} comments
            </Link>
            <button onClick={handleShare} className={styles.actionBtn}>
              {copied ? '✓ Copied!' : '🔗 Share'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post; 