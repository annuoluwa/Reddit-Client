import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, selectPostStatus, selectPostError, selectAfter, selectHasMore } from "./postsSlice";
import { fetchPosts } from "./postsSlice";
import Post from "./Post";
import styles from"./postLists.module.css";

//PostLists component
// component fetches and displays Reddit posts on the homepage
function PostLists({ searchTerm, subreddit }) {
    const [searchResults, setSearchResults] = React.useState([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchError, setSearchError] = React.useState(null);

    // Fetch from backend /search when searchTerm is set
    React.useEffect(() => {
      if (searchTerm && searchTerm.trim() !== "") {
        setSearchLoading(true);
        setSearchError(null);
        fetch(`/search?q=${encodeURIComponent(searchTerm)}&limit=10`)
          .then(res => {
            if (!res.ok) throw new Error('Search failed');
            return res.json();
          })
          .then(data => {
            if (data && data.data && Array.isArray(data.data.children)) {
              setSearchResults(data.data.children.map(child => child.data));
            } else {
              setSearchResults([]);
            }
          })
          .catch(err => {
            setSearchError('Search failed');
            setSearchResults([]);
          })
          .finally(() => setSearchLoading(false));
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    }, [searchTerm]);
  const dispatch = useDispatch();
  const postlists = useSelector(selectPosts);
  const showStatus = useSelector(selectPostStatus);
  const showError = useSelector(selectPostError);
  const after = useSelector(selectAfter);
  const hasMore = useSelector(selectHasMore);

  // Use search results directly if searching, otherwise show subreddit posts
  const postsToDisplay = searchTerm && searchTerm.trim() !== ""
    ? searchResults
    : postlists;

  // Debug logs for search troubleshooting (must come after all variable declarations)
  React.useEffect(() => {
    console.log('All posts:', postlists);
    console.log('Posts to display:', postsToDisplay);
    console.log('Search term:', searchTerm);
  }, [postlists, postsToDisplay, searchTerm]);

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
  if (showStatus === "loading" && postlists.length === 0) {
    return <div>Loading...</div>;
  } else if (showStatus === "failed") {
    return <div>Error: {showError}</div>;
  } else if (showStatus === "succeeded") {
    return (
      <div className={styles.postListContainer}>        
        {postsToDisplay.map((post) => (<Post key={post.id} post={post} />))}ss
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
}

export default PostLists;