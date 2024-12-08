import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import styles from "./LoginSignup.module.css";
import passwordIcon from "../../assets/password.png";
import usernameIcon from "../../assets/username.png";
import logo from "../../assets/logo.png";

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            const result = await axios.post(process.env.REACT_APP_POST_ROUTE_LOGIN, 
                {username: username, password: password}, { withCredentials: true });
            console.log(result);
            if (result.data.message === "Success") {
                localStorage.setItem('userId', result.data.userId);
                localStorage.setItem('authToken', result.data.token);
                setIsAuthenticated(true);
                navigate('/');
            } else if (result.data === 'Incorrect username or password') {
                setErrorMessage('Incorrect username or password');
            }
        } 
        catch (error) {
            console.log(error);
            setErrorMessage('An error occurred. Please try again');
        } 
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
			<div className={styles.brandContainer}>
        		<img src={logo} alt="My Portfolio Watch Logo" />
        		<div className={styles.brandText}>My Portfolio Watch</div>
    		</div>
            <div className={styles.header}>
                <div className={styles.text}>Login</div>
            </div>
            <form onSubmit={handleSubmit}>
            <div className={styles.inputs}>
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
                <div className={styles.dontHaveAccount}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>
            <div className={styles.submitContainer}>
                <button type="submit" className={styles.submit} disabled={isLoading}>
                    {isLoading ? <div className={styles.spinner}></div> : 'Login'}
                </button>
            </div>
            </form>
        </div>
    );
};

export default Login;