import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./api";
import axios from "axios";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user profile

        // Fetch recent projects
        const projectsResponse = await axios.get(
          `${API_BASE_URL}/projects?limit=5`,
          { headers }
        );
        setProjects(projectsResponse.data.projects);

        // Fetch recent tasks assigned to user
        const tasksResponse = await axios.get(
          `${API_BASE_URL}/tasks?assigned_to_me=1&limit=5`,
          { headers }
        );
        setTasks(tasksResponse.data.tasks);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-2">Loading dashboard...</div>
        </div>
      </div>
    );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard container py-4">
      <h1 className="mb-4">Project Management System</h1>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Menu</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-3">
                <Link to="/projects/create" className="btn btn-outline-primary">
                  New Project
                </Link>
                {/* <Link to="/tasks/create" className="btn btn-outline-success">
                  New Task
                </Link> */}
                <Link to="/projects" className="btn btn-outline-info">
                  Manage Projects
                </Link>
                {/* <Link to="/tasks" className="btn btn-outline-secondary">
                  Manage Tasks
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Projects</h5>
              <Link to="/projects" className="btn btn-primary btn-sm">
                View All Projects
              </Link>
            </div>
            <div className="card-body">
              {projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                <div className="list-group">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">{project.name}</h6>
                        <small>
                          {project.description
                            ? `${project.description.substring(0, 50)}...`
                            : "No description"}
                        </small>
                      </div>
                      <span
                        className={`badge bg-${getStatusBadge(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* <div className="mt-3">
                <Link to="/projects/create" className="btn btn-success">
                  Create New Project
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Tasks</h5>
              <Link to="/tasks" className="btn btn-primary btn-sm">
                View All Tasks
              </Link>
            </div>
            <div className="card-body">
              {tasks.length === 0 ? (
                <p>No tasks assigned to you.</p>
              ) : (
                <div className="list-group">
                  {tasks.map((task) => (
                    <Link
                      key={task.id}
                      to={`/tasks/${task.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">{task.title}</h6>
                        <small>
                          Project:{" "}
                          {task.project?.name || `Project #${task.project_id}`}
                        </small>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <span
                          className={`badge bg-${getStatusBadge(task.status)}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                        <small className="mt-1">
                          Due:{" "}
                          {task.due_time
                            ? new Date(task.due_time).toLocaleDateString()
                            : "Not set"}
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  switch (status) {
    case "planning":
      return "secondary";
    case "active":
      return "primary";
    case "completed":
      return "success";
    case "on_hold":
      return "warning";
    case "todo":
      return "secondary";
    case "in_progress":
      return "primary";
    case "review":
      return "info";
    default:
      return "light";
  }
};

export default Dashboard;
