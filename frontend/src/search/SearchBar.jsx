import React, { useRef, useEffect, useState } from "react";
import styles from "./search.module.css";

function SearchBar({ searchTerm, setSearchTerm }) {
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const timerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setSearchTerm(value.trim());
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search posts"
      />
      <button
        type="button"
        aria-label="Search"
        className={styles.button}
      >
        🔍
      </button>
    </div>
  );
}

export default SearchBar;
