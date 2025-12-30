import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPosts,
  selectPostStatus,
  selectPostError,
  selectAfter,
  selectHasMore,
  fetchPosts,
} from "./postsSlice";
import Post from "./Post";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import styles from "./postLists.module.css";

const BASE_URL = "/api";

function PostLists({ searchTerm, subreddit }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const dispatch = useDispatch();
  const postlists = useSelector(selectPosts);
  const showStatus = useSelector(selectPostStatus);
  const showError = useSelector(selectPostError);
  const after = useSelector(selectAfter);
  const hasMore = useSelector(selectHasMore);

  const postsToDisplay =
    searchTerm && searchTerm.trim() !== "" ? searchResults : postlists;

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    async function fetchSearch() {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const res = await fetch(
          `${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}&limit=10`
        );
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = await res.json();
        setSearchResults(
          data.data?.children?.map((child) => child.data) || []
        );
      } catch (err) {
        setSearchError("Search failed");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }

    fetchSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") return;
    if (!subreddit) return;
    dispatch(fetchPosts({ subreddit, after: null, limit: 5 }));
  }, [subreddit, searchTerm, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (searchTerm && searchTerm.trim() !== "") return;
    if (hasMore && showStatus !== "loading") {
      dispatch(fetchPosts({ subreddit, after, limit: 5 }));
    }
  }, [dispatch, subreddit, after, hasMore, showStatus, searchTerm]);

  if (searchTerm && searchTerm.trim() !== "") {
    if (searchLoading) {
      return (
        <div className={styles.postListContainer}>
          <LoadingSkeleton count={3} />
        </div>
      );
    }
    if (searchError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <span className={styles.errorIcon}>⚠️</span>
            <h3>Oops! Something went wrong</h3>
            <p>{searchError}</p>
          </div>
        </div>
      );
    }
    if (postsToDisplay.length === 0) {
      return <EmptyState message="No posts found" />;
    }
    return (
      <div className={styles.postListContainer}>
        {postsToDisplay.map((post, index) => (
          <Post key={post.id ?? index} post={post} />
        ))}
      </div>
    );
  }

  if (showStatus === "loading" && postlists.length === 0) {
    return (
      <div className={styles.postListContainer}>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (showStatus === "failed") {
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
  }

  const uniquePosts = [...new Map(postlists.map((p) => [p.id, p])).values()];

  return (
    <div className={styles.postListContainer}>
      {uniquePosts.length === 0 ? (
        <EmptyState message="No posts found" />
      ) : (
        <>
          {uniquePosts.map((post, index) => (
            <Post key={post.id ?? index} post={post} />
          ))}

          <button
            onClick={handleLoadMore}
            disabled={showStatus === "loading" || !hasMore}
            className={styles.viewMoreButton}
          >
            {showStatus === "loading"
              ? "Loading..."
              : hasMore
              ? "View More"
              : "No More Posts"}
          </button>
        </>
      )}
    </div>
  );
}

export default PostLists;
