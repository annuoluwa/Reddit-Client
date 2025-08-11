import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, selectPostStatus, selectPostError, selectAfter, selectHasMore } from "./postsSlice";
import { fetchPosts } from "./postsSlice";
import Post from "./Post";
//PostLists component
//This component fetches and displays Reddit posts on the homepage
function PostLists({searchTerm, subreddit}) {
const dispatch = useDispatch();
    const  postlists = useSelector(selectPosts); //gives the current array of posts from the store
    const showStatus = useSelector(selectPostStatus);
    const showError = useSelector(selectPostError);
    const after = useSelector(selectAfter); //Pagination cursor
    const hasMore = useSelector(selectHasMore); // Boolean: more posts available
    
    //the filter allows case-insensitive matching and returns only posts that match the search
const filteredPosts = searchTerm ? postlists.filter(post => (post.title|| "").toLowerCase().includes(searchTerm.toLowerCase())) : postlists;
    
console.log("posts from Redux:", postlists);

useEffect(() => {
    if (!subreddit) return;
    dispatch(fetchPosts({ subreddit, after: null, limit: 5}))
}, [subreddit, dispatch]);

const handleViewMore = () => {
    if(hasMore && showStatus !== "loading"){

    dispatch(fetchPosts({subreddit, after, limit: 5}))
    };
}


    if (showStatus === 'loading' && postlists.length === 0) {
        return <div>loading...</div>

    } else if(showStatus === "failed"){
        return <div>error: {showError} </div>

    } else if(showStatus === "succeeded"){
        //if fetch is successful, it maps over the post array and renders each post in a styled card
        //post includes a title,, thumbnail(if available), author, subreddit, score and comment count. 
        
        const uniquePosts = [...new Map(filteredPosts.map(post => [post.id, post])).values()];

        return (
            <div className = "postList-container">
 {uniquePosts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        uniquePosts.map((post, index) => (
          <Post key={post.id ?? index} post={post} />
        ))
      )}
        <button onClick={handleViewMore} disabled={showStatus === 'loading' || !hasMore}>
            {showStatus === 'loading' ? 'Loading...' : hasMore ? "View More" : "No More Posts"}
        </button>
        </div>
        
    
)
    };
};


export default PostLists;