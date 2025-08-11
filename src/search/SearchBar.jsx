import React, { useRef, useEffect, useState } from "react";
import styles from './search.module.css'
function SearchBar({searchTerm, setSearchTerm}) {
    const[inputValue, setInputValue] = useState('');
    const timer = useRef();

    const handleChange =(e) =>{

        setInputValue(e.target.value)
        //debounce timer setup
if (timer.current){
    clearTimeout(timer.current);
}
timer.current = setTimeout(() => { //300ms typical debounce delay to prevent unneccessary frequent update and excessive fecthes. 
    setSearchTerm(e.target.value)
}, 300);
    };

useEffect(() => { //cleanup of timer to prevent memory leaks.
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
    

    return(
        <div 
        className={styles.searchBar}>
        <input 
        className={styles.searchBar}
        type="text" 
        name="text" 
        value={inputValue} 
        onChange={handleChange}
        placeholder="Search posts"/> 
        <button type="submit" aria-label="Search" className={styles.button}>🔍</button>
          </div>
    )
}

export default SearchBar;