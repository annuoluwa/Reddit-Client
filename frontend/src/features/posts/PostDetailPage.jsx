import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from './postDetailPage.module.css';

const BASE_URL = "/api";

function PostDetailPage() {
  const { postId } = useParams();
  const location = useLocation();
  const subreddit = location.state?.subreddit;

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subreddit || !postId) {
      setError("Subreddit information missing. Please navigate from the posts list.");
      setLoading(false);
      return;
    }

    async function fetchPostDetails() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/comments/${subreddit}/${postId}`);
        if (!response.ok) throw new Error(`Network response not ok: ${response.status}`);

        const data = await response.json();

        setPostData(data[0]?.data?.children[0]?.data);
        setComments(data[1]?.data?.children || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Failed to load post');
        setLoading(false);
      }
    }

    fetchPostDetails();
  }, [postId, subreddit]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!postData) return <p>No post found</p>;

  const invalidThumbValues = ['self', 'default', 'nsfw', 'image', ''];
  const isValidImageUrl = (url) =>
    url && !invalidThumbValues.includes(url) && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'));
  const imageUrl = isValidImageUrl(postData.thumbnail)
    ? (postData.thumbnail.startsWith('//') ? 'https:' + postData.thumbnail : postData.thumbnail)
    : '/no-image.png';

  return (
    <div className={styles.postData}>
      <h2 className={styles.postTitle}>{postData.title}</h2>
      <div className={styles.postMeta}>
        <span>Author: {postData.author}</span>
        <span>r/{postData.subreddit}</span>
      </div>
      {postData.selftext && (
        <div className={styles.postContent}>{postData.selftext}</div>
      )}
      <img
        className={styles.postImage}
        src={imageUrl}
        alt="Post thumbnail"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/no-image.png';
        }}
      />
      <div className={styles.commentSection}>
        <h3 className={styles.commentTitle}>Comments:</h3>
        <ul>
          {comments.map((comment) =>
            comment.kind === 't1' ? (
              <li key={comment.data.id} className={styles.commentUL}>
                <strong className={styles.commentAuthor}>{comment.data.author}</strong>: {comment.data.body}
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}

export default PostDetailPage;
