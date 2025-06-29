import React from 'react'
import styles from './NotFound.module.css'; // Adjust the path as necessary

const NotFound = () => {
  return (
    <div>
          <div className={styles.container}>
              <div className={styles.content}>
                  <h1 className={styles.header}>404</h1>
                  <p className={styles.subheader}>Page Not Found</p>
                  <p className={styles.message}>Oops! The page you’re looking for doesn’t exist.</p>
                  <a className={styles.homeLink} href="/">Go Back to Home</a>
              </div>
          </div>
    </div>
  )
}

export default NotFound
