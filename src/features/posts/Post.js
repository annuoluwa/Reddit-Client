 import React from "react";
 import { Link } from "react-router-dom";
import styles from './post.module.css';
 function Post({post}){
  if (!post) return null;
const {
  id,
  title,
  author,
  subreddit,
  thumbnail,
  score,
  num_comments,
} = post;

//const isValidImage = post.thumbnail && post.thumbnail.startsWith('http');
//const imageUrl = isValidImage ? post.thumbnail : '/No-image.png'
  
return (
    <div className= {styles.postCard}>
    <Link to={`/post/${id}`}state={{subreddit}} className={styles.postLink}>

                    <h3 className={styles.postTitle}>{title}</h3>

               
                   {/*Only render thumbnail if it's a valid URL*/}
  <img className={styles.postImage}
  src={post.thumbnail}
  alt="Post thumbnail"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/no-image.png';
  }}
/>


                    <p className={styles.para}>Posted by {author} in r/{subreddit}</p>

                    <p className={styles.postScore}>{score} | {num_comments}</p>
                </Link>
       </div>         
)

 }
export default Post; 