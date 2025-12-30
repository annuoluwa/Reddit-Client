import React, { useState, useRef, useEffect } from "react";
import styles from "./SubredditSelector.module.css";

function SubredditSelector({ subreddit, setSubreddit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef(null);

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
    "custom",
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSubreddit(value);
      setIsOpen(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customValue.trim()) {
      setSubreddit(customValue.trim());
      setIsCustom(false);
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.dropdown} ref={dropdownRef}>
        <button
          className={styles.dropdownToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select subreddit"
        >
          {isCustom
            ? customValue || "Custom..."
            : subreddit || "Select Subreddit"}
          <span className={styles.arrow}>▼</span>
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            {subreddits.map((sub) => (
              <button
                key={sub}
                className={styles.dropdownItem}
                onClick={() => handleSelect(sub)}
              >
                {sub === "custom" ? "✏️ Custom..." : sub}
              </button>
            ))}
          </div>
        )}
      </div>

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
          <button type="submit" className={styles.customButton}>
            Go
          </button>
        </form>
      )}
    </div>
  );
}

export default SubredditSelector;
