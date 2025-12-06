import React from "react";
import styles from "./SubredditSelector.module.css";

function SubredditSelector({ subreddit, setSubreddit }) {
  const subreddits = [
    "all",
    "announcement",
    "funny",
    "AskReddit",
    "gaming",
    "worldnews",
    "todayilearned",
    "aww",
    "Music",
    "memes",
    "movies",
    "science",
    "AIArt",
    "antiwork"
  ];

  return (
    <select
      value={subreddit}
      onChange={(e) => setSubreddit(e.target.value)}
      id="subreddit-select"
      className={styles.subredditSelect}
    >
      <option value="">-- Select Subreddit --</option>
      {subreddits.map((sub) => (
        <option key={sub} value={sub}>
          {sub}
        </option>
      ))}
    </select>
  );
}

export default SubredditSelector;
