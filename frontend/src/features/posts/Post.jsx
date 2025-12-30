import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./post.module.css";
import ImageModal from "../../components/ImageModal";
import { useToast } from "../../context/ToastContext";
import { useBookmarks } from "../../hooks/useBookmarks";

const getRelativeTime = (timestamp) => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  const months = Math.floor(diff / 2592000);
  if (diff < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return `${months}mo ago`;
};

function Post({ post }) {
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
    ups,
    score,
    num_comments,
    created_utc,
    thumbnail,
    preview,
    permalink,
    url_overridden_by_dest,
    post_hint,
  } = post;

  const invalidThumbValues = ["self", "default", "nsfw", "image", ""];

  const isValidImageUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    const u = url.toLowerCase();
    const validExt =
      u.endsWith(".jpg") ||
      u.endsWith(".jpeg") ||
      u.endsWith(".png") ||
      u.endsWith(".gif") ||
      u.includes("redd.it") ||
      u.includes("i.redd.it") ||
      u.includes("i.reddituploads");
    return url.startsWith("http") && validExt;
  };

  const unescapeUrl = (u) => (u ? u.replace(/&amp;/g, "&") : u);

  let imageUrl = null;
  if (preview?.images?.[0]?.source?.url) {
    imageUrl = unescapeUrl(preview.images[0].source.url);
  } else if (isValidImageUrl(url_overridden_by_dest)) {
    imageUrl = unescapeUrl(url_overridden_by_dest);
  } else if (thumbnail && !invalidThumbValues.includes(thumbnail)) {
    imageUrl = unescapeUrl(thumbnail);
  }

  const hasImage = post_hint === "image" || isValidImageUrl(imageUrl);

  const handleShare = (e) => {
    e.preventDefault();
    const url = `https://reddit.com${permalink}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast?.success?.("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    if (hasImage) setShowModal(true);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    toggleBookmark(post);
    toast?.success?.(isBookmarked(id) ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const displayScore =
    (ups || score || 0) > 1000 ? `${((ups || score || 0) / 1000).toFixed(1)}k` : (ups || score || 0);

  return (
    <>
      {showModal && (
        <ImageModal
          imageUrl={imageUrl}
          title={title}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className={styles.postCard} data-post-card>
        <div className={styles.voteSection}>
          <button className={styles.voteBtn} aria-label="Upvote">
            ⬆️
          </button>
          <span className={styles.voteScore}>{displayScore}</span>
          <button className={styles.voteBtn} aria-label="Downvote">
            ⬇️
          </button>
        </div>

        <div className={styles.contentSection}>
          <Link to={`/post/${id}`} state={{ subreddit }} className={styles.postLink}>
            <h3 className={styles.postTitle}>{title}</h3>

            {hasImage && imageUrl && (
              <img
                className={styles.postImage}
                src={imageUrl}
                alt="Post thumbnail"
                onClick={handleImageClick}
                style={{ cursor: hasImage ? "pointer" : "default" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = process.env.PUBLIC_URL + "/no-image.png";
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
              className={`${styles.actionBtn} ${isBookmarked(id) ? styles.bookmarked : ""}`}
              title={isBookmarked(id) ? "Remove bookmark" : "Bookmark post"}
            >
              {isBookmarked(id) ? "🔖 Saved" : "📌 Save"}
            </button>
            <Link to={`/post/${id}`} state={{ subreddit }} className={styles.actionBtn}>
              💬 {num_comments} comments
            </Link>
            <button onClick={handleShare} className={styles.actionBtn}>
              {copied ? "✓ Copied!" : "🔗 Share"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
