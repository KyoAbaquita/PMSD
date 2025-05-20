import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../api"; 
import axios from "axios";

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    due_date: "",
    status: "planning",
    budget: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_BASE_URL}/projects/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const project = response.data.project;
          setFormData({
            name: project.name,
            description: project.description || "",
            start_date: project.start_date
              ? project.start_date.split("T")[0]
              : "",
            due_date: project.due_date ? project.due_date.split("T")[0] : "",
            status: project.status,
            budget: project.budget || "",
          });
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch project details");
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const method = isEditing ? "put" : "post";
      const url = isEditing
        ? `${API_BASE_URL}/projects/${id}`
        : `${API_BASE_URL}/projects`;
      console.log("Submitting project formData:", formData);

      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/projects");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to save project: ${err.response.data.message}`);
      } else {
        setError("You dont have permission to perform this action.");
      }
      console.error("Project save error:", err);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-2">Loading Form...</div>
      </div>
    </div>
  );

  return (
    <div className="project-form">
      <h2>{isEditing ? "Edit Project" : "Create New Project"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Project Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="start_date" className="form-label">
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col">
            <label htmlFor="due_date" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              className="form-control"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="budget" className="form-label">
            Budget (₱)
          </label>
          <input
            type="number"
            className="form-control"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Project" : "Create Project"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/projects")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
