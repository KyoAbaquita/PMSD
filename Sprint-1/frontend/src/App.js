import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login.js";
import Register from "./components/registration.js";
import Dashboard from "./components/dashboard.js";
import "./App.css";

const App = () => {
    // State to manage authentication token, initialized from localStorage
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Function to handle login and store the token in localStorage
    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken); // Save token for persistent login
        setToken(newToken);
    };

    // Function to handle logout and remove the token from localStorage
    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear stored token
        setToken(null);
    };

    return (
        <Router>
            <Routes>
                {/* If user is authenticated, redirect to dashboard; otherwise, show login page */}
                <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />

                {/* If user is authenticated, redirect to dashboard; otherwise, show registration page */}
                <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />} />

                {/* If user is authenticated, show dashboard; otherwise, redirect to login */}
                <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
