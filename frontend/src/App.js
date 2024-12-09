import "./App.css";
import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./pages/LoginSignup/Login";
import Signup from './pages/LoginSignup/Signup';
import DashBoard from "./pages/Dashboard/Dashboard";
import AboutUs from './pages/Links/AboutUs';
import Contact from './pages/Links/Contact';
import FAQ from './pages/Links/FAQ';
import axios from 'axios';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(process.env.REACT_APP_GET_TOKEN, {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });
                setIsAuthenticated(response.data.isAuthenticated)
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
                <Route path="/about-us" element={isAuthenticated ? <AboutUs /> : <Navigate to="/login" />} />
                <Route path="/contact" element={isAuthenticated ? <Contact /> : <Navigate to="/login" />} />
                <Route path="/faq" element={isAuthenticated ? <FAQ /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
        </Router>
    );
}

export default App;