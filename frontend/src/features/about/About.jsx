import React from 'react';
import styles from './about.module.css';

function About() {
    return(
        <div className= {styles.aboutContainer}>
            <h1 className={styles.title}>About Reddit-Client</h1>

            <p className={styles.text}>Reddit-Client is a web application that allows users to browse and interact with Reddit content in a streamlined and user-friendly interface.            Think of this as a tiny window into Reddit — clean, fast, and focused.
            Pick a subreddit, search for something interesting, or just scroll and discover.
            Enjoy the simplicity</p>

        </div>
    )
}

export default About;