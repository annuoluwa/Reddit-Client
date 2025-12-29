import React from "react";
import styles from "./SubredditSelector.module.css";

function SubredditSelector({ subreddit, setSubreddit }) {
  const subreddits = [
    "all",
    "announcements",
    "funny",
    "AskReddit",
    "gaming",
    "worldnews",
    "todayilearned",
    "aww",
    "music",
    "memes",
    "movies",
    "science",
    "AIArt",
    "antiwork",
  ];

  return (
    <select
      value={subreddit}
      onChange={(e) => setSubreddit(e.target.value)}
      className={styles.subredditSelect}
    >
      {subreddits.map((sub) => (
        <option key={sub} value={sub}>
          r/{sub}
        </option>
      ))}
    </select>
  );
}

export default SubredditSelector;
