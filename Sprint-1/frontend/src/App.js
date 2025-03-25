import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login.js";
import Register from "./components/registration.js";
import Dashboard from "./components/dashboard.js";
import "./App.css";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
                <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />} />
                <Route path="/dashboard" element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
