import React from "react";
import { Link } from "react-router-dom";
import styles from './nav.module.css';
import { useTheme } from '../../context/ThemeContext';

function Nav() {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <>
        <nav className={styles.nav}>
            <img src="logo2.png" className={styles.logo} alt="Reddit-Client logo"></img>
           
            <div className={styles.navLinks}>
                <Link className={styles.link} to ='/' >Home</Link>
                <Link className={styles.link} to ='/about'>About</Link>
                <button 
                    onClick={toggleTheme} 
                    className={styles.themeToggle}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        
        </nav>
        </>
    )
};

export default Nav;