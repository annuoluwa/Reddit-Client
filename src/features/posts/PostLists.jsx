import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, selectPostStatus, selectPostError, selectAfter, selectHasMore } from "./postsSlice";
import { fetchPosts } from "./postsSlice";
import Post from "./Post";
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

  const filteredPosts = searchTerm
    ? postlists.filter(post => (post.title || "").toLowerCase().includes(searchTerm.toLowerCase()))
    : postlists;

  useEffect(() => {
    if (!subreddit) return;
    dispatch(fetchPosts({ subreddit, after: null, limit: 5 }));
  }, [subreddit, dispatch]);

  const handleViewMore = () => {
    if (hasMore && showStatus !== "loading") {
      dispatch(fetchPosts({ subreddit, after, limit: 5 }));
    }
  };

  if (showStatus === "loading" && postlists.length === 0) {
    return <div>Loading...</div>;
  } else if (showStatus === "failed") {
    return <div>Error: {showError}</div>;
  } else if (showStatus === "succeeded") {
    const uniquePosts = [...new Map(filteredPosts.map(post => [post.id, post])).values()];

    return (
      <div className={styles.postListContainer}>
        {uniquePosts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          uniquePosts.map((post, index) => <Post key={post.id ?? index} post={post} />)
        )}

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