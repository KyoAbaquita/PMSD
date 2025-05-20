import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsError, setCommentsError] = useState(null);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/tasks/${taskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTask(response.data.task);
        // dump the task object to console
        console.log("Fetched task:", response.data.task);
        setLoading(false); // important!
      } catch (err) {
        setError("Failed to fetch task details.");
        setLoading(false); // important!
      }
    };

    fetchTask();

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };

    fetchUser();

    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/tasks/${taskId}/files`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFiles(response.data.files);
      } catch (err) {
        console.error("Failed to fetch files");
      }
    };

    fetchFiles();
  }, [taskId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/tasks/${taskId}/comments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments(response.data.comments);
      } catch (err) {
        setCommentsError("Failed to fetch comments.");
      }
    };

    fetchComments();
    const interval = setInterval(fetchComments, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        { ...task, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTask({ ...task, status: newStatus });
    } catch (err) {
      setError("Failed to update task status");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/projects/${task.project_id}/tasks`);
    } catch (err) {
      setError("Failed to delete task");
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/tasks/${taskId}/comments`,
        { comment: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => [response.data.comment, ...prev]);
      setNewComment("");
    } catch (err) {
      setCommentsError("Failed to post comment.");
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/tasks/${taskId}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFiles((prev) => [...prev, response.data.file]);
      setFile(null);
      e.target.reset(); // Reset the form
    } catch (err) {
      setFileError("Failed to upload file.");
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/files/${fileId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Important for file data
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. You may not have permission.");
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
          <div className="mt-2">Fetching Task Details...</div>
        </div>
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="task-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{task.title}</h2>
        <div>
          <Link
            to={`/projects/${task.project_id}/tasks`}
            className="btn btn-secondary me-2"
          >
            Back to Tasks
          </Link>
          {user && task.project?.owner_id === user.id && (
            <>
              <Link
                to={`/tasks/${taskId}/edit`}
                className="btn btn-warning me-2"
              >
                Edit Task
              </Link>
              <button onClick={handleDeleteTask} className="btn btn-danger">
                Delete Task
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">Task Details</div>
            <div className="card-body">
              <p>
                <strong>Description:</strong>
              </p>
              <p>{task.description || "No description provided"}</p>

              <div className="row mt-4">
                <div className="col-md-6">
                  <p>
                    <strong>Project:</strong>{" "}
                    <Link to={`/projects/${task.project_id}`}>
                      {task.project?.name || `Project #${task.project_id}`}
                    </Link>
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`badge bg-${getStatusBadge(task.status)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span
                      className={`badge bg-${getPriorityBadge(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Assigned To:</strong>{" "}
                    {task.assigned_user?.name || "Unassigned"}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {task.due_time
                      ? new Date(task.due_time).toLocaleDateString()
                      : "Not set"}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">Comments</div>
            <div className="card-body">
              {commentsError && (
                <div className="alert alert-danger">{commentsError}</div>
              )}

              <form onSubmit={handleCommentSubmit} className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    Post
                  </button>
                </div>
              </form>

              <ul className="list-group">
                {comments.length === 0 ? (
                  <li className="list-group-item">No comments yet.</li>
                ) : (
                  comments.map((comment) => (
                    <li key={comment.id} className="list-group-item">
                      <strong>{comment.user?.name || "Unknown User"}</strong>
                      <br />
                      <small className="text-muted">
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                      <p className="mb-0 mt-1">{comment.comment}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="card mt-4 mb-4">
            <div className="card-header">Attachments</div>
            <div className="card-body">
              {fileError && (
                <div className="alert alert-danger">{fileError}</div>
              )}

              <form onSubmit={handleFileUpload} className="mb-3">
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Upload
                  </button>
                </div>
              </form>

              {files.length === 0 ? (
                <p>No files uploaded for this task.</p>
              ) : (
                <ul className="list-group">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{f.filename}</strong>
                        <br />
                        <small className="text-muted">
                          Uploaded by {f.user?.name}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleDownload(f.id, f.filename)}
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">Update Status</div>
            <div className="card-body">
              <div className="d-flex gap-2">
                <button
                  className={`btn ${
                    task.status === "todo"
                      ? "btn-secondary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => handleStatusChange("todo")}
                >
                  To Do
                </button>
                <button
                  className={`btn ${
                    task.status === "in_progress"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleStatusChange("in_progress")}
                >
                  In Progress
                </button>
                <button
                  className={`btn ${
                    task.status === "review" ? "btn-info" : "btn-outline-info"
                  }`}
                  onClick={() => handleStatusChange("review")}
                >
                  Review
                </button>
                <button
                  className={`btn ${
                    task.status === "completed"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => handleStatusChange("completed")}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* You can add additional task information or related features here */}
        </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  switch (status) {
    case "todo":
      return "secondary";
    case "in_progress":
      return "primary";
    case "review":
      return "info";
    case "completed":
      return "success";
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

export default TaskDetail;
