import React from "react";
//This component allows user to filter their desired posts via subreddits.
function SubredditSelector({subreddit, setSubreddit}){
const subreddits = ['all', 'annoucement', 'funny', 'AskReddit', 'gaming', 'worldnews', 'todayilearned', 'aww', 'Music', 'memes', 'movies', 'science', 'AIArt', 'antiwork' ]

return (
    <>
    <select  //render a dropdown
    value={subreddit} 
    onChange = {(e) => setSubreddit(e.target.value)}
    id="subreddit-select"
    >
        <option value="">-- Select Subreddit --</option>
{subreddits.map((sub)=> (
    <option key={sub} value={sub}> {sub} </option>
))}
    </select>
    </>
)
}


export default SubredditSelector;