 import React from "react";
 import { Link } from "react-router-dom";

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

  
return (
    <div className="post-card">
    <Link to={`/post/${id}`}state={{subreddit}}>

                    <h3>{title}</h3>

                 {thumbnail && thumbnail.startsWith("http") && (

                    //Only render thumbnail if it's a valid URL
  <img src={thumbnail} alt="post thumbnail" />
)}
                    <p>Posted by {author} in r/{subreddit}</p>

                    <p>{score} | {num_comments}</p>
                </Link>
       </div>         
)

 }
export default Post; 