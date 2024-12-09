import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.returnLink}>
          ← Return to Dashboard
        </Link>
      </header>
      <main className={styles.mainContent}>
        <h1>About Us</h1>
        <p>
          Welcome to <strong>My Portfolio Watch</strong>! Our mission is to help you track and manage
          your portfolio effortlessly. Whether you're dealing with stocks, crypto, or commodities,
          we provide the tools and insights you need to stay on top of your investments.
        </p>
        <p>
          Our dedicated team is passionate about simplifying portfolio management for everyone,
          from beginners to experienced traders.
        </p>
        <p>
          Thank you for choosing us as your portfolio partner. If you have any questions or
          suggestions, feel free to <Link to="/contact">Contact Us</Link>.
        </p>
      </main>
    </div>
  );
};

export default AboutUs;