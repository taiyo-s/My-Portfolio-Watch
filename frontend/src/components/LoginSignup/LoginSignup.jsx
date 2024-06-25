import React, { useState } from "react";
import "./LoginSignup.css";

import nameIcon from "../assets/name.png";
import passwordIcon from "../assets/password.png";
import usernameIcon from "../assets/username.png";

const LoginSignup = () => {
    const [action, setAction] = useState("Login");

    return (
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
            </div>
            <div className="inputs">
                {action === "Login"? <div></div>:<div className="input">
                    <img src={nameIcon} alt="Name Icon" />
                    <input type="text" placeholder="Name" />
                </div>}
                <div className="input">
                    <img src={usernameIcon} alt="Username Icon" />
                    <input type="text" placeholder="Username" />
                </div>
                <div className="input">
                    <img src={passwordIcon} alt="Password Icon" />
                    <input type="password" placeholder="Password" />
                </div>
            </div>
            <div className="submitContainer">
                <div
                    className={action === "Sign Up" ? "submit grey" : "submit"}
                    onClick={() => {setAction("Sign Up")}}>Sign up</div>
                <div className={action === "Login" ? "submit grey" : "submit"}
                    onClick={() => {setAction("Login")}}>Login</div>
            </div>
        </div>
    );
};

export default LoginSignup;
