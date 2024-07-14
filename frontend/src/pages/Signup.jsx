import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./LoginSignup.css";
import axios from 'axios'
import nameIcon from "../assets/name.png";
import passwordIcon from "../assets/password.png";
import usernameIcon from "../assets/username.png";

const Signup = () => {
    const [name, setName] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await axios.post(process.env.REACT_APP_POST_ROUTE_SIGNUP, 
                {name: name, username: username, password: password});
            console.log(result);
            if (result.data.message === "Success") {
                localStorage.setItem('username', result.data.username);
                navigate('/Dashboard');
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
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
            </div>
            <form onSubmit={handleSubmit}>
            <div className="inputs">
                <div className="input">
                    <img src={nameIcon} alt="Name Icon" />
                    <input type="text" placeholder="Name"
                        onChange={(e) => setName(e.target.value)} required/>
                </div>
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
                <div className="haveOrDontHaveAccount">
                    Already have an account? <Link to="/Login">Login</Link>
                </div>
            </div>
            <div className="submitContainer">
                <button type="submit" className="submit" disabled={isLoading}>
                    {isLoading ? <div className="spinner"></div> : 'Sign up'}
                </button>
            </div>
            </form>
        </div>
    );
};

export default Signup;
