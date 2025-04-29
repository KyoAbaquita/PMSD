import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planning',
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8000/api/projects/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          const project = response.data.project;
          setFormData({
            name: project.name,
            description: project.description || '',
            start_date: project.start_date ? project.start_date.split('T')[0] : '',
            end_date: project.end_date ? project.end_date.split('T')[0] : '',
            status: project.status,
          });
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch project details');
          setLoading(false);
        }
      };
      
      fetchProject();
    }
  }, [id, isEditing]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const method = isEditing ? 'put' : 'post';
      const url = isEditing 
        ? `http://localhost:8000/api/projects/${id}`
        : 'http://localhost:8000/api/projects';
      
      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      navigate('/projects');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to save project: ${err.response.data.message}`);
      } else {
        setError('Failed to save project');
      }
      console.error('Project save error:', err);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="project-form">
      <h2>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Project Name</label>
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
          <label htmlFor="description" className="form-label">Description</label>
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
            <label htmlFor="start_date" className="form-label">Start Date</label>
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
            <label htmlFor="end_date" className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
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
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Project' : 'Create Project'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/projects')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
