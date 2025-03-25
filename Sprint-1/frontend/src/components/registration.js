import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("team_member");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, password_confirmation: confirmPassword, role }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate("/");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            setError("Server error");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="admin">Admin</option>
                        <option value="project_manager">Project Manager</option>
                        <option value="team_member">Team Member</option>
                        <option value="client">Client</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Register
                    </button>
                </form>
                <button
                    onClick={() => navigate("/")}
                    className="w-full p-3 mt-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default Register;
