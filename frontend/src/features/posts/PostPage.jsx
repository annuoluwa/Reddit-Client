import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PostLists from "./PostLists";
import SearchBar from "../../search/SearchBar";
import SubredditSelector from "./SubredditSelector";
import { fetchPosts, setCurrentSubreddit } from "./postsSlice";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import styles from "./PostPage.module.css";

function PostsPage() {
  const dispatch = useDispatch();
  const { toggleTheme } = useTheme();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [subreddit, setSubreddit] = useState("all");
  const [sortType, setSortType] = useState("hot");

  useEffect(() => {
    const currentSubreddit =
      subreddit === "all" ? "popular" : subreddit || "popular";
    dispatch(setCurrentSubreddit(currentSubreddit));
    dispatch(
      fetchPosts({
        subreddit: currentSubreddit,
        after: null,
        limit: 5,
        sort: sortType,
      })
    );
  }, [dispatch, subreddit, sortType]);

  const scrollToPost = (direction) => {
    const posts = document.querySelectorAll('[data-post-card]');
    if (posts.length === 0) return;

    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let targetPost = null;

    if (direction === "next") {
      for (let post of posts) {
        if (post.offsetTop > scrollPosition) {
          targetPost = post;
          break;
        }
      }
    } else {
      for (let i = posts.length - 1; i >= 0; i--) {
        if (posts[i].offsetTop < scrollPosition - 100) {
          targetPost = posts[i];
          break;
        }
      }
    }

    if (targetPost) {
      targetPost.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useKeyboardShortcuts({
    onFocusSearch: () => {
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput) {
        searchInput.focus();
        toast.info("Press ESC to exit search");
      }
    },
    onToggleTheme: () => {
      toggleTheme();
      toast.info("Theme toggled");
    },
    onRefresh: () => {
      const currentSubreddit =
        subreddit === "all" ? "popular" : subreddit || "popular";
      dispatch(
        fetchPosts({
          subreddit: currentSubreddit,
          after: null,
          limit: 5,
          sort: sortType,
        })
      );
      toast.info("Posts refreshed");
    },
    onNextPost: () => scrollToPost("next"),
    onPrevPost: () => scrollToPost("prev"),
    onEscape: () => {
      const input = document.activeElement;
      if (input?.blur) input.blur();
    },
  });

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles.controls}>
        <SubredditSelector subreddit={subreddit} setSubreddit={setSubreddit} />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className={styles.sortSelect}
          aria-label="Select sort order"
        >
          <option value="hot">🔥 Hot</option>
          <option value="new">🆕 New</option>
          <option value="top">⬆️ Top</option>
          <option value="rising">📈 Rising</option>
        </select>
      </div>
      <PostLists searchTerm={searchTerm} subreddit={subreddit} />
    </>
  );
}

export default PostsPage;
