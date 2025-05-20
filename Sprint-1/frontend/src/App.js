import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "./components/layout/Nav";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import Register from "./components/registration";
import ProjectList from "./components/projects/ProjectList";
import ProjectForm from "./components/projects/ProjectForm";
import ProjectDetail from "./components/projects/ProjectDetail";
import ProjectMembers from "./components/projects/ProjectMembers";
import TaskList from "./components/tasks/TaskList";
import TaskForm from "./components/tasks/TaskForm";
import TaskDetail from "./components/tasks/TaskDetail";
import ExpenditureList from "./components/expenditure/ExpenditureList";
import AddExpenditure from "./components/expenditure/AddExpenditure";
import ProjectReport from "./components/projects/ProjectReport";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // State to track loading status (to show loading spinner until authentication check completes)
  const [loading, setLoading] = useState(true);

  // useEffect hook to check authentication status when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data?.id) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Function to handle user logout, removing the token from localStorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Function to handle user login, storing the token in localStorage
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // While authentication check is loading, display a loading spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* If authenticated, display the navigation bar */}
        {isAuthenticated && <Nav user={user} onLogout={handleLogout} />}

        <div className="container py-4">
          <Routes>
            {/* Dashboard route - only accessible when authenticated */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Login route */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Registration route */}
            <Route path="/register" element={<Register />} />

            {/* Project routes - Ensure user is authenticated */}
            <Route
              path="/projects"
              element={
                isAuthenticated ? <ProjectList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/projects/create"
              element={
                isAuthenticated ? <ProjectForm /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/projects/:id"
              element={
                isAuthenticated ? <ProjectDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/projects/:id/members"
              element={
                isAuthenticated ? <ProjectMembers /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/projects/:id/edit"
              element={
                isAuthenticated ? <ProjectForm /> : <Navigate to="/login" />
              }
            />

            {/* Task routes - Also require authentication */}
            <Route
              path="/projects/:projectId/tasks"
              element={
                isAuthenticated ? <TaskList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/projects/:projectId/tasks/create"
              element={
                isAuthenticated ? <TaskForm /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/tasks"
              element={
                isAuthenticated ? <TaskList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/tasks/:taskId"
              element={
                isAuthenticated ? <TaskDetail /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/tasks/:taskId/edit"
              element={
                isAuthenticated ? <TaskForm /> : <Navigate to="/login" />
              }
            />

            {/* Catch-all route for unknown paths, redirecting to home */}
            <Route path="*" element={<Navigate to="/" />} />

            <Route
              path="/projects/:id/expenditures"
              element={
                isAuthenticated ? <ExpenditureList /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/projects/:id/expenditures/add"
              element={
                isAuthenticated ? <AddExpenditure /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/projects/:id/report"
              element={
                isAuthenticated ? <ProjectReport /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Exporting the App component to use it in other parts of the app
export default App;
