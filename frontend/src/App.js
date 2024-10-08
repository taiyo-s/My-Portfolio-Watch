import "./App.css";
import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./pages/LoginSignup/Login";
import Signup from './pages/LoginSignup/Signup';
import DashBoard from "./pages/Dashboard/Dashboard";
import axios from 'axios';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_GET_TOKEN, 
                    { withCredentials: true });
                setIsAuthenticated(response.data.isAuthenticated)
            } catch (error) {
                setIsAuthenticated(false);
                console.error('Error verifying session:', error);
            }
        };
        verifySession();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
        </Router>
    );
}

export default App;