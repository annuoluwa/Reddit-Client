import React, { useState } from "react";
import styles from "./SubredditSelector.module.css";

function SubredditSelector({ subreddit, setSubreddit }) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  
  const subreddits = [
    "popular",
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
    "custom"
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSubreddit(value);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customValue.trim()) {
      setSubreddit(customValue.trim());
    }
  };

  return (
    <div className={styles.selectorContainer}>
      <select
        value={isCustom ? "custom" : subreddit}
        onChange={handleChange}
        id="subreddit-select"
        className={styles.subredditSelect}
      >
        <option value="">-- Select Subreddit --</option>
        {subreddits.map((sub) => (
          <option key={sub} value={sub}>
            {sub === "custom" ? "✏️ Custom..." : sub}
          </option>
        ))}
      </select>
      
      {isCustom && (
        <form onSubmit={handleCustomSubmit} className={styles.customForm}>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Enter subreddit name"
            className={styles.customInput}
            autoFocus
          />
          <button type="submit" className={styles.customButton}>Go</button>
        </form>
      )}
    </div>
  );
}

export default SubredditSelector;
