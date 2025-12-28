import React, {useEffect, useRef, useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, selectPostStatus, selectPostError, selectAfter, selectHasMore, fetchPosts } from "./postsSlice";
import Post from "./Post";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import styles from"./postLists.module.css";

//PostLists component
//This component fetches and displays Reddit posts on the homepage
function PostLists({ searchTerm, subreddit }) {
  const dispatch = useDispatch();
  const postlists = useSelector(selectPosts);
  const showStatus = useSelector(selectPostStatus);
  const showError = useSelector(selectPostError);
  const after = useSelector(selectAfter);
  const hasMore = useSelector(selectHasMore);
  const observerRef = useRef();
  const loadMoreRef = useRef();

  const filteredPosts = searchTerm
    ? postlists.filter(post => (post.title || "").toLowerCase().includes(searchTerm.toLowerCase()))
    : postlists;

  useEffect(() => {
    if (!subreddit) return;
    dispatch(fetchPosts({ subreddit, after: null, limit: 5 }));
  }, [subreddit, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && showStatus !== "loading") {
      dispatch(fetchPosts({ subreddit, after, limit: 5 }));
    }
  }, [dispatch, subreddit, after, hasMore, showStatus]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore]);

  if (showStatus === "loading" && postlists.length === 0) {
    return (
      <div className={styles.postListContainer}>
        <LoadingSkeleton count={3} />
      </div>
    );
  } else if (showStatus === "failed") {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <span className={styles.errorIcon}>⚠️</span>
          <h3>Oops! Something went wrong</h3>
          <p>{showError}</p>
          <button 
            onClick={() => dispatch(fetchPosts({ subreddit, after: null, limit: 5 }))}
            className={styles.retryButton}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  } else if (showStatus === "succeeded") {
    const uniquePosts = [...new Map(filteredPosts.map(post => [post.id, post])).values()];

    return (
      <div className={styles.postListContainer}>
        {uniquePosts.length === 0 ? (
          <EmptyState message="No posts found" />
        ) : (
          <>
            {uniquePosts.map((post, index) => <Post key={post.id ?? index} post={post} />)}
            
            {hasMore && (
              <div ref={loadMoreRef} className={styles.loadMore}>
                {showStatus === "loading" && <LoadingSkeleton count={2} />}
              </div>
            )}
            
            {!hasMore && <p className={styles.endMessage}>You've reached the end! 🎉</p>}
          </>
        )}
      </div>
    );
  }
}

export default PostLists;