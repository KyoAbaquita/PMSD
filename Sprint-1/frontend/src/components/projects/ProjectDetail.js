import React, { useState, useEffect } from "react";
import ProjectGanttChart from "./ProjectGanttChart";
import RiskIssuePanel from "./RiskIssuePanel";
import { API_BASE_URL } from "../api";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualCost, setActualCost] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const projectResponse = await axios.get(
          `${API_BASE_URL}/projects/${id}`,
          { headers }
        );

        const tasksResponse = await axios.get(
          `${API_BASE_URL}/projects/${id}/tasks`,
          { headers }
        );

        const expendituresResponse = await axios.get(
          `${API_BASE_URL}/projects/${id}/expenditures`,
          { headers }
        );

        const expenditures = expendituresResponse.data;
        const totalCost = expenditures.reduce(
          (sum, exp) => sum + Number(exp.amount),
          0
        );

        const userResponse = await axios.get(`${API_BASE_URL}/user`, {
          headers,
        });
        const currentUserId = userResponse.data.id;

        setProject(projectResponse.data.project);
        setIsOwner(projectResponse.data.project.user_id === currentUserId);
        setProject(projectResponse.data.project);
        setActualCost(totalCost);
        setTasks(tasksResponse.data.tasks);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch project details");
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleDeleteProject = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project and all associated tasks?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/projects");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete project";
      setError(message);

      setTimeout(() => {
        navigate(-1);
      }, 3000);
    }
  };

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
          <div className="mt-2">Loading Project Detail...</div>
        </div>
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!project) return <div>Project not found</div>;

  // Calculate project stats
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "completed").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    todo: tasks.filter((task) => task.status === "todo").length,
    review: tasks.filter((task) => task.status === "review").length,
  };

  const completionPercentage =
    taskStats.total > 0
      ? Math.round((taskStats.completed / taskStats.total) * 100)
      : 0;

  return (
    <div className="container py-4">
      <div className="project-detail">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{project.name}</h2>
          <div>
            <Link to="/projects" className="btn btn-secondary me-2">
              Back to Projects
            </Link>
            {isOwner && (
              <>
                <Link
                  to={`/projects/${id}/edit`}
                  className="btn btn-warning me-2"
                >
                  Edit Project
                </Link>
                <button
                  onClick={handleDeleteProject}
                  className="btn btn-danger"
                >
                  Delete Project
                </button>
              </>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-header">Project Details</div>
              <div className="card-body">
                <p>
                  <strong>Description:</strong>{" "}
                  {project.description || "No description provided"}
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge bg-${getStatusBadge(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </p>
                    <p>
                      <strong>Members:</strong>{" "}
                      <Link
                        to={`/projects/${project.id}/members`}
                        className="btn btn-sm btn-outline-primary ms-2"
                      >
                        Manage Members
                      </Link>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(project.start_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Due Date:</strong>{" "}
                      {project.due_date
                        ? new Date(project.due_date).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">Project Progress & Budget</div>
              <div className="card-body">
                <div className="progress mb-3">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${completionPercentage}%` }}
                    aria-valuenow={completionPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {completionPercentage}%
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Budget:</strong> ₱
                  {Number(project.budget || 0).toFixed(2)}
                  <br />
                  <br />
                  <strong>Remaining Budget:</strong> ₱
                  {Number(project.budget - actualCost).toFixed(2)}
                  <br />
                  <br />
                  <strong>Actual Cost:</strong> ₱
                  {Number(actualCost || 0).toFixed(2)}
                  <br />
                  <br />
                  <strong>Status:</strong>{" "}
                  {actualCost > project.budget ? (
                    <span className="text-danger">Over Budget</span>
                  ) : (
                    <span className="text-success">Within Budget</span>
                  )}
                </div>

                <div className="task-stats">
                  <div className="row text-center">
                    <div className="col-3">
                      <div className="stat-item">
                        <div className="stat-value">{taskStats.todo}</div>
                        <div className="stat-label">Todo</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="stat-item">
                        <div className="stat-value">{taskStats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="stat-item">
                        <div className="stat-value">{taskStats.review}</div>
                        <div className="stat-label">Review</div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="stat-item">
                        <div className="stat-value">{taskStats.completed}</div>
                        <div className="stat-label">Done</div>
                      </div>
                    </div>
                  </div>
                </div>
                {isOwner && (
                  <div className="d-flex flex-column gap-2 mt-3">
                    <Link
                      to={`/projects/${id}/expenditures`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Expenditure Records
                    </Link>
                    <Link
                      to={`/projects/${id}/expenditures/add`}
                      className="btn btn-outline-success btn-sm"
                    >
                      Record New Expenditure
                    </Link>
                    <Link
                      to={`/projects/${project.id}/report`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      View Report
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4 mb-4">
          <div className="card-header">Gantt Chart Visualization</div>
          <div className="card-body">
            <ProjectGanttChart tasks={tasks} />
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-4">Tasks</h5>
            <Link
              to={`/projects/${id}/tasks`}
              className="btn btn-primary btn-sm"
            >
              Manage Tasks
            </Link>
          </div>
          <div className="card-body">
            {tasks.length === 0 ? (
              <p>No tasks found for this project.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assigned To</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.slice(0, 5).map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>
                          <span
                            className={`badge bg-${getStatusBadge(
                              task.status
                            )}`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${getPriorityBadge(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td>{task.assignedUser?.name || "Unassigned"}</td>
                        <td>
                          {task.due_time
                            ? new Date(task.due_time).toLocaleDateString()
                            : "Not set"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tasks.length > 5 && (
                  <div className="text-center mt-2">
                    <Link to={`/projects/${id}/tasks`} className="btn btn-link">
                      View all {tasks.length} tasks
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-header">Risks and Issues</div>
          <div className="card-body">
            <RiskIssuePanel projectId={id} isOwner={isOwner} />
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

const getPriorityBadge = (priority) => {
  switch (priority) {
    case "low":
      return "success";
    case "medium":
      return "info";
    case "high":
      return "warning";
    case "urgent":
      return "danger";
    default:
      return "secondary";
  }
};

export default ProjectDetail;
