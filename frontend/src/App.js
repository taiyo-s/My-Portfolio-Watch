import "./App.css";
import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./pages/LoginSignup/Login";
import Signup from './pages/LoginSignup/Signup';
import DashBoard from "./pages/Dashboard/Dashboard";
import axios from 'axios';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_GET_SESSION, 
                    { withCredentials: true });
                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
                console.error('Error verifying session:', error);
            } finally {
                setIsLoading(false);
            }
        };
        verifySession();
    }, []);
    
    if (isLoading) {
        return;
    }

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