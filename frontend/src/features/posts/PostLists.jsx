import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPosts,
  selectPostStatus,
  selectPostError,
  selectAfter,
  selectHasMore,
  fetchPosts
} from "./postsSlice";
import Post from "./Post";
import styles from "./postLists.module.css";

const BASE_URL = "/api"; // relative to Netlify function

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

  const postsToDisplay = searchTerm && searchTerm.trim() !== ""
    ? searchResults
    : postlists;

  // Debug logs
  useEffect(() => {
    console.log('All posts:', postlists);
    console.log('Posts to display:', postsToDisplay);
    console.log('Search term:', searchTerm);
  }, [postlists, postsToDisplay, searchTerm]);

  // Fetch search results from backend /search
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
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}&limit=10`);
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = await res.json();
        setSearchResults(data.data?.children?.map(child => child.data) || []);
      } catch (err) {
        console.error("Search fetch error:", err);
        setSearchError("Search failed");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }

    fetchSearch();
  }, [searchTerm]);

  // Fetch subreddit posts if no search term
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== "") return;
    if (!subreddit) return;
    dispatch(fetchPosts({ subreddit, after: null, limit: 5 }));
  }, [subreddit, searchTerm, dispatch]);

  const handleViewMore = () => {
    if (hasMore && showStatus !== "loading") {
      dispatch(fetchPosts({ subreddit, after, limit: 5 }));
    }
  };

  // Render search results if searching
  if (searchTerm && searchTerm.trim() !== "") {
    if (searchLoading) return <div>Searching...</div>;
    if (searchError) return <div>Error: {searchError}</div>;
    if (postsToDisplay.length === 0) return <div>No posts found</div>;
    return (
      <div className={styles.postListContainer}>
        {postsToDisplay.map((post, index) => <Post key={post.id ?? index} post={post} />)}
      </div>
    );
  }

  // Default: subreddit posts
  if (showStatus === "loading" && postlists.length === 0) return <div>Loading...</div>;
  if (showStatus === "failed") return <div>Error: {showError}</div>;

  return (
    <div className={styles.postListContainer}>
      {postsToDisplay.map((post) => (<Post key={post.id} post={post} />))}
      <button
        onClick={handleViewMore}
        disabled={showStatus === "loading" || !hasMore}
        className={styles.viewMoreButton}
      >
        {showStatus === "loading" ? "Loading..." : hasMore ? "View More" : "No More Posts"}
      </button>
    </div>
  );
}

export default PostLists;
