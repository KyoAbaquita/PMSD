import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = ({ onLogin }) => {
    // State variables to store user input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    // Function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        try {
            // Send login request to the API
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }), // Convert input values to JSON
            });

            const data = await response.json(); // Parse API response

            if (response.ok) {
                // Store authentication token in localStorage
                localStorage.setItem("token", data.token);

                // Trigger login callback function
                onLogin(data.token);

                // Redirect user to the dashboard after successful login
                navigate("/dashboard");
            } else {
                // Display error message if login fails
                setError(data.message || "Login failed");
            }
        } catch (error) {
            // Handle server errors
            setError("Server error");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {/* Display error message if authentication fails */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            {/* Login form */}
            <form onSubmit={handleLogin}>
                {/* Email input field */}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                
                {/* Password input field */}
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                
                {/* Login button */}
                <button type="submit">Login</button>
            </form>

            {/* Registration prompt */}
            <p>Don't have an account?</p>
            <button onClick={() => navigate("/register")}>Register</button> {/* Redirects to registration page */}
        </div>
    );
};

export default Login;
