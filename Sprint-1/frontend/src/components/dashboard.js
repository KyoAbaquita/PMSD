import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await fetch("http://127.0.0.1:8000/api/logout", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            });
            onLogout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <p>Welcome! You are logged in.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
