import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Contact.module.css';

const ContactUs = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.returnLink}>
          ← Return to Dashboard
        </Link>
      </header>
      <main className={styles.mainContent}>
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Feel free to reach out to us through the following channels:
        </p>
        <ul className={styles.contactList}>
          <li>
            <strong>Email:</strong>{' '}
            <a href="mailto:jhk2704@gmail.com" className={styles.contactLink}>
              support
            </a>
          </li>
          <li>
            <strong>Instagram:</strong>{' '}
            <a
              href="https://instagram.com/monkeydonkeyballs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              @monkeydonkeyballs
            </a>
          </li>
        </ul>
        <p>
          We'll do our best to respond as quickly as possible. Thank you for reaching out!
        </p>
      </main>
    </div>
  );
};

export default ContactUs;