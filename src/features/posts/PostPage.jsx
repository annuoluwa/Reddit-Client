import React, { useState, useEffect } from "react";
import PostLists from "./PostLists";
import SearchBar from "../../search/SearchBar"; 
import SubredditSelector from "./SubredditSelector";
import { fetchPosts, setCurrentSubreddit } from "./postsSlice";
import { useDispatch } from "react-redux";
import styles from "./PostPage.module.css";

//this parent component hold the search state and renders both SearchBar and PostLists

function PostsPage(){
const [searchTerm, setSearchTerm] = useState('');
const [subreddit, setSubreddit] = useState('all');
const [sortType, setSortType] = useState('hot');

 const dispatch = useDispatch();

  useEffect(() => {
    const currentSubreddit = subreddit || 'all'
    dispatch(setCurrentSubreddit(currentSubreddit));
    dispatch(fetchPosts({ subreddit: currentSubreddit, after: null, limit: 5, sort: sortType }));
  }, [dispatch, subreddit, sortType]);

return(
    <>
    <SearchBar searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
    <div className={styles.controls}>
      <SubredditSelector subreddit = {subreddit} setSubreddit = {setSubreddit} />
      <select 
        value={sortType} 
        onChange={(e) => setSortType(e.target.value)}
        className={styles.sortSelect}
      >
        <option value="hot">🔥 Hot</option>
        <option value="new">🆕 New</option>
        <option value="top">⬆️ Top</option>
        <option value="rising">📈 Rising</option>
      </select>
    </div>
    <PostLists searchTerm = {searchTerm} subreddit = {subreddit}/>
    </>
)
};

export default PostsPage;