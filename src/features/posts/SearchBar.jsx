import React, { useRef, useEffect, useState } from "react";

function SearchBar({searchTerm, setSearchTerm}) {
    const[inputValue, setInputValue] = useState('');
    const timer = useRef();

    const handleChange =(e) =>{

        setInputValue(e.target.value)
        
if (timer.current){
    clearTimeout(timer.current);
}
timer.current = setTimeout(() => {
    setSearchTerm(e.target.value)
}, 300);
    };

useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
    

    return(
        <>
        <input 
        type="text" 
        name="text" 
        value={inputValue} 
        onChange={handleChange}
        placeholder="Search posts"/> 
        
          </>
    )
}

export default SearchBar;