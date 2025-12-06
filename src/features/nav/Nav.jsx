import React from "react";
import { Link } from "react-router-dom";
import styles from './nav.module.css'

function Nav() {
    return (
        <>
        <nav className={styles.nav}>
            <img src="logo2.png" className={styles.logo}></img>
           
            <Link className={styles.link} to ='/' >Home</Link>

            <Link className={styles.link}to ='/about'>About</Link>
        
        </nav>
        </>
    )
};

export default Nav;