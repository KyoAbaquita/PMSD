import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css"; // Import the CSS file

// Login component handles user authentication and navigation to the dashboard.
const Login = ({ onLogin }) => {
    const [email, setEmail] = useState(""); // State to store email input
    const [password, setPassword] = useState(""); // State to store password input
    const [error, setError] = useState(""); // State to store error messages
    const navigate = useNavigate();

    // Handle login form submissions
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }), // Send email and password to the API
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data.token); // Pass the token to the parent component
                navigate("/dashboard"); // Redirect to the dashboard
            } else {
                setError(data.message || "Login failed"); // Display error message
            }
        } catch (error) {
            setError("Server error"); // Handle server errors
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Klick Inc</h2>
                {error && <p className="auth-error">{error}</p>}
                <form onSubmit={handleLogin}>
                    {/* Email input field */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    {/* Password input field */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    {/* Submit button */}
                    <button type="submit" className="auth-button">Login</button>
                </form>
                {/* Button to navigate to the registration page */}
                <button onClick={() => navigate("/register")} className="auth-register">Create New Account</button>
            </div>
        </div>
    );
};

export default Login;
