import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

function PostDetailPage() {
    const {postId} = useParams(); //grab postId from url
    const [postData, setPostData] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const subreddit = location.state?.subreddit;

    useEffect(() => {
        console.log('Fetching post with ID:', postId)
        if (!subreddit || !postId) {
            setError("Subreddit information missing. Please navigate from the posts list.");
            setLoading(false);
            return;
        }
     async function fetchPostDetails(){
        setLoading(true);
        setError(null);

        try {


            const response = await fetch(`http://localhost:4000/comments/${subreddit}/${postId}`);

        if (!response.ok) throw new Error("Network response not ok");
        const data = await response.json();
        setPostData(data[0]?.data?.children[0]?.data);
        setComments(data[1]?.data?.children);
       
        setLoading(false);
        
        } catch(error){
            setError('Failed to load post');
            setLoading(false)
        }
        }    
fetchPostDetails()
    
    }, [postId, subreddit])

    if (loading) {
        return <p>loading...</p>
    }
    if(error){
       return  <p>{error}</p>
    }
    if(!postData){
        return <p>No post found</p>
    }


        return(
            <>
            <h2>{postData.title}</h2>
            <p>Author: {postData.author}</p>
            <p>{postData.selftext}</p>
            {postData.thumbnail && postData.thumbnail.startsWith("http") && (
            <img src={postData.thumbnail} alt=''/> //conditionally render the image only if valid
)}
            <h3>Comments:</h3>
            <ul>
                {comments.map((comment) => comment.kind === 't1' ? (
                    <li key={comment.data.id}>
                        <strong>{comment.data.author}</strong>: {comment.data.body}
                    </li>
                ) : null)}
            </ul>
            </>
        );
    }
    

    export default PostDetailPage;