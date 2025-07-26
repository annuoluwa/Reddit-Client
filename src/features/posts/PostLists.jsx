import React from "react";
import { useSelector } from "react-redux";
import { selectPosts, selectPostStatus, selectPostError } from "./postsSlice";
import Post from "./Post";
//PostLists component
//This component fetches and displays Reddit posts on the homepage
function PostLists({searchTerm, subreddit}) {

    const  postlists = useSelector(selectPosts); //gives the current array of posts from the store
    const showStatus = useSelector(selectPostStatus);
    const showError = useSelector(selectPostError);
    //the filter allows case-insensitive matching and returns only posts that match the search
const filteredPosts = searchTerm ? postlists.filter(post => (post.title|| "").toLowerCase().includes(searchTerm.toLowerCase())) : postlists;
    
console.log("posts from Redux:", Post);


    if (showStatus === 'loading') {
        return <div>loading...</div>

    } else if(showStatus === "failed"){
        return <div>error: {showError} </div>

    } else if(showStatus === "succeeded"){
        //if fetch is successful, it maps over the post array and renders each post in a styled card
        //post includes a title,, thumbnail(if available), author, subreddit, score and comment count. 
        
        
        return (
            <div className = "postList-container">
                {filteredPosts.length === 0?(<p> No posts found</p>) : ( 
            filteredPosts.map((post, index) => (
  <Post key={post.id ?? index} post={post} />
))
)
        }
        </div>
        
    
)
    };
};


export default PostLists;