import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import "./LoginSignup.css";
import passwordIcon from "../assets/password.png";
import usernameIcon from "../assets/username.png";

const Login = () => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(process.env.REACT_APP_POST_ROUTE, 
            {username: username, password: password})
        .then(result => {
            console.log(result)
            navigate('/Main')
        })
        .catch(error => console.log(error))
    }

    return (
        <div className="container">
            <div className="header">
                <div className="text">Login</div>
            </div>
            <form onSubmit={handleSubmit}>
            <div className="inputs">
                <div className="input">
                    <img src={usernameIcon} alt="Username Icon" />
                    <input type="text" placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="input">
                    <img src={passwordIcon} alt="Password Icon" />
                    <input type="password" placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        autoComplete="off" required/>
                </div>
            </div>
            <div className="signupContainer">
                <div className="dontHaveAccount">
                    Don't have an account? <Link to="/Signup">Sign up</Link>
                </div>
            </div>
            <div className="submitContainer">
                <button type="submit" className="submit">Login</button>
            </div>
            </form>
        </div>
    );
};

export default Login;