import { useState, useEffect } from 'react';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarkedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (postId) => {
    return bookmarks.some(bookmark => bookmark.id === postId);
  };

  const toggleBookmark = (post) => {
    setBookmarks(prev => {
      const exists = prev.some(bookmark => bookmark.id === post.id);
      if (exists) {
        return prev.filter(bookmark => bookmark.id !== post.id);
      } else {
        return [...prev, post];
      }
    });
  };

  return { bookmarks, isBookmarked, toggleBookmark };
};
