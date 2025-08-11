import React, { useState, useEffect } from "react";
import PostLists from "./PostLists";
import SearchBar from "../../search/SearchBar"; 
import SubredditSelector from "./SubredditSelector";
import { fetchPosts, setCurrentSubreddit } from "./postsSlice";
import { useDispatch } from "react-redux";

//this parent component hold the search state and renders both SearchBar and PostLists

function PostsPage(){
const [searchTerm, setSearchTerm] = useState('');
const [subreddit, setSubreddit] = useState('all') //create user's reddit filter

 const dispatch = useDispatch();

  useEffect(() => {
    const currentSubreddit = subreddit || 'all'
    dispatch(setCurrentSubreddit(currentSubreddit));  // update currentSubreddit in redux
    dispatch(fetchPosts(currentSubreddit));           // fetch posts for the selected subreddit
  }, [dispatch, subreddit]);

return(
    <>
    <SearchBar searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
    <SubredditSelector subreddit = {subreddit} setSubreddit = {setSubreddit} />
    <PostLists searchTerm = {searchTerm} subreddit = {subreddit}/>
    </>
)
};

export default PostsPage;