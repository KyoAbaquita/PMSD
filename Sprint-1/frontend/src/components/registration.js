import React, { useState } from "react";
import { API_BASE_URL } from "./api";
import { useNavigate } from "react-router-dom";

const Registration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("team_member");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            setPasswordStrength("weak");
        } else if (
            /[A-Z]/.test(newPassword) &&
            /[a-z]/.test(newPassword) &&
            /[0-9]/.test(newPassword)
        ) {
            setPasswordError("");
            setPasswordStrength("strong");
        } else {
            setPasswordError("");
            setPasswordStrength("medium");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: confirmPassword,
                    role,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h3 className="text-center mb-3">Create Account</h3>
                        <p className="text-center text-muted mb-4">
                            Join our team management platform
                        </p>

                        {error && (
                            <div className="alert alert-danger text-center">{error}</div>
                        )}

                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                {passwordStrength && (
                                    <div className="mt-1">
                                        <div
                                            className={`progress ${
                                                passwordStrength === "strong"
                                                    ? "bg-success"
                                                    : passwordStrength === "medium"
                                                    ? "bg-warning"
                                                    : "bg-danger"
                                            }`}
                                            style={{ height: "5px" }}
                                        >
                                            <div
                                                className={`progress-bar`}
                                                style={{
                                                    width:
                                                        passwordStrength === "strong"
                                                            ? "100%"
                                                            : passwordStrength === "medium"
                                                            ? "66%"
                                                            : "33%",
                                                }}
                                            ></div>
                                        </div>
                                        <small className="text-muted">
                                            Strength: {passwordStrength}
                                        </small>
                                    </div>
                                )}
                                {passwordError && (
                                    <small className="text-danger d-block">
                                        {passwordError}
                                    </small>
                                )}
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3 d-none">
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    {/* <option value="admin">Admin</option> */}
                                    <option value="project_manager">Project Manager</option>
                                    <option value="team_member">Team Member</option>
                                    <option value="client">Client</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Create Account
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            <small className="text-muted">or</small>
                        </div>

                        <button
                            onClick={() => navigate("/")}
                            className="btn btn-outline-secondary w-100 mt-2"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
