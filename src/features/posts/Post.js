 import React from "react";
 
 function Post({post}){
  if (!post) return null;

  const {
    title,
    author,
    subreddit,
    url,
    thumbnail,
    score,
    num_comments,
  } = post;
  
return (
    <div className="paost-card">
    <a href= {post.url} target="_blank" rel="noopener noreferrer">

                    <h3>{post.title}</h3>

                 {post.thumbnail && post.thumbnail.startsWith("http") && (

                    //Only render thumbnail if it's a valid URL
  <img src={post.thumbnail} alt="post thumbnail" />
)}
                    <p>Posted by {post.author} in r/{post.subreddit}</p>

                    <p>{post.score} | {post.num_comments}</p>
                </a>
       </div>         
)

 }
export default Post; 