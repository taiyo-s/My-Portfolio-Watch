import "./App.css";
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./pages/LoginSignup/Login";
import Signup from './pages/LoginSignup/Signup';
import DashBoard from "./pages/Dashboard/Dashboard";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <DashBoard /> : <Navigate to="/Login" />} />
                <Route path="/Login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/Signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
        </Router>
    );
}

export default App;