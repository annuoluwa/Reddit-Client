import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PostLists from "./PostLists";
import SearchBar from "../../search/SearchBar";
import SubredditSelector from "./SubredditSelector";
import { fetchPosts, setCurrentSubreddit } from "./postsSlice";

function PostsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subreddit, setSubreddit] = useState('all');

  const dispatch = useDispatch();

  useEffect(() => {
    const currentSubreddit = subreddit || 'all';
    dispatch(setCurrentSubreddit(currentSubreddit)); // update currentSubreddit in redux
    dispatch(fetchPosts({ subreddit: currentSubreddit, after: null, limit: 5 })); // fetch initial posts
  }, [dispatch, subreddit]);

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <SubredditSelector subreddit={subreddit} setSubreddit={setSubreddit} />
      <PostLists searchTerm={searchTerm} subreddit={subreddit} />
    </>
  );
}

export default PostsPage;
