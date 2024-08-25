import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./LoginSignup.module.css";

const Timeout = () => {
    
    const navigate = useNavigate();
    const handleLoginRedirect = () => {
        navigate('/login');
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.text}>Please Sign in Again</div>
            </div>
            <div className={styles.submitContainer}>
                <button type="submit" className={styles.submit} 
                    onClick={handleLoginRedirect}> OK
                </button>
            </div>
        </div>
    );
};

export default Timeout;