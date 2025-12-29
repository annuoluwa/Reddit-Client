import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from './postDetailPage.module.css';

const BASE_URL = process.env.REACT_APP_API_URL;

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


            const response = await fetch(`${BASE_URL}/comments/${subreddit}/${postId}`);

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
            < div className={styles.postData}>
            <h2 className= {styles.postTitle}>{postData.title}</h2>
            <p className= {styles.postAuthor}>Author: {postData.author}</p>
            <p className= {styles.postSelfText}>{postData.selftext}</p>
           <img className={styles.postImage}
  src={postData.thumbnail}
  alt="PostData thumbnail"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/no-image.png';
  }}
/>
            <h3 className= {styles.comments}>Comments:</h3>
            <ul className= {styles.commentUL}>
                {comments.map((comment) => comment.kind === 't1' ? (
                    <li key={comment.data.id} className= {styles.commentUL}>
                        <strong className={styles.commentAuthor}>{comment.data.author}</strong>: {comment.data.body}
                    </li>
                ) : null)}
            </ul>
            </div>
        );
    }
    

    export default PostDetailPage;