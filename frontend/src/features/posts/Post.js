import React from "react";
import { Link } from "react-router-dom";
import styles from './post.module.css';

function Post({ post }) {
  if (!post) return null;

  const { id, title, author, subreddit, thumbnail, score, num_comments } = post;

  const invalidThumbValues = ['self', 'default', 'nsfw', 'image', ''];

  const isValidImageUrl = (url) => {
    if (!url) return false;
    return !invalidThumbValues.includes(url) && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'));
  };

  const imageUrl = isValidImageUrl(thumbnail)
    ? (thumbnail.startsWith('//') ? 'https:' + thumbnail : thumbnail)
    : process.env.PUBLIC_URL + '/no-image.png';

  return (
    <div className={styles.postCard}>
      <Link to={`/post/${id}`} state={{ subreddit }} className={styles.postLink}>
        <h3 className={styles.postTitle}>{title}</h3>
        <img
          className={styles.postImage}
          src={imageUrl}
          alt="Post thumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = process.env.PUBLIC_URL + '/no-image.png';
          }}
        />
        <p className={styles.para}>Posted by {author} in r/{subreddit}</p>
        <p className={styles.postScore}>{score} | {num_comments}</p>
      </Link>
    </div>
  );
}

export default Post;
