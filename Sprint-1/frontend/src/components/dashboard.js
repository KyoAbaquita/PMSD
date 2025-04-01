import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            // Retrieve authentication token from localStorage
            const token = localStorage.getItem("token");

            // Send logout request to the API
            await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            });

            // Call the onLogout function to clear authentication state
            onLogout();

            // Redirect user to the home page after logout
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <p>Welcome! You are logged in.</p>
            {/* Logout button triggers handleLogout function */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
