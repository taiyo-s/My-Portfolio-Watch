import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is My Portfolio Watch?',
      answer:
        'My Portfolio Watch is a platform that helps you track and manage your portfolio, including stocks, crypto, commodities, and more, all in one place.',
    },
    {
      question: 'How do I add items to my portfolio?',
      answer:
        'To add items, click the "Add" button in the dashboard. Select the type of investment and fill in the details. Your portfolio will be updated instantly.',
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.returnLink}>
          ← Return to Dashboard
        </Link>
      </header>
      <main className={styles.mainContent}>
        <h1>Frequently Asked Questions</h1>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.questionButton}
                onClick={() => toggleQuestion(index)}
              >
                <span>{faq.question}</span>
                <span className={styles.arrow}>
                  {openQuestion === index ? '▲' : '▼'}
                </span>
              </button>
              {openQuestion === index && (
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.contactSection}>
          <h2>Still have questions?</h2>
          <p>
            If you didn’t find the answer you were looking for, feel free to{' '}
            <Link to="/contact" className={styles.contactLink}>
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
};

export default FAQ;