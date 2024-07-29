import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from "./LoginSignup.module.css";
import axios from 'axios'
import nameIcon from "../../assets/name.png";
import passwordIcon from "../../assets/password.png";
import usernameIcon from "../../assets/username.png";

const Signup = ({ setIsAuthenticated }) => {
    const [name, setName] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            const result = await axios.post(process.env.REACT_APP_POST_ROUTE_SIGNUP, 
                {name: name, username: username, password: password}, { withCredentials: true });
            console.log(result);
            if (result.data.message === "Success") {
                localStorage.setItem('username', result.data.username);
                setIsAuthenticated(true);
                navigate('/');
            } else if (result.data === 'Username is already taken') {
                setErrorMessage('Username is already taken');
            }
        } 
        catch (error) {
            console.log(error);
        } 
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.text}>Sign Up</div>
            </div>
            <form onSubmit={handleSubmit}>
            <div className={styles.inputs}>
                <div className={styles.input}>
                    <img src={nameIcon} alt="Name Icon" />
                    <input type="text" placeholder="Name"
                        onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className={styles.input}>
                    <img src={usernameIcon} alt="Username Icon" />
                    <input type="text" placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className={styles.input}>
                    <img src={passwordIcon} alt="Password Icon" />
                    <input type="password" placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        autoComplete="off" required/>
                </div>
            </div>
            {errorMessage && <div className={styles.error}>* {errorMessage}. *</div>} 
            <div className={styles.signupContainer}>
                <div className={styles.haveOrDontHaveAccount}>
                    Already have an account? <Link to="/Login">Login</Link>
                </div>
            </div>
            <div className={styles.submitContainer}>
                <button type="submit" className={styles.submit} disabled={isLoading}>
                    {isLoading ? <div className={styles.spinner}></div> : 'Sign up'}
                </button>
            </div>
            </form>
        </div>
    );
};

export default Signup;
