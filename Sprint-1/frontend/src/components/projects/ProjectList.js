import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data.projects);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-2">Fetching Projects...</div>
      </div>
    </div>
  );
  if (error) return <div>{error}</div>;
  
  return (
    <div className="project-list">
      <h2>Projects</h2>
      <Link to="/projects/create" className="btn btn-primary mb-3">Create New Project</Link>
      
      <div className="row">
        {projects.length === 0 ? (
          <p>No projects found. Create a new project to get started.</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text">{project.description}</p>
                  <div className="d-flex justify-content-between mb-2">
                    <span className={`badge bg-${getStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                    <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                  </div>
                  <Link to={`/projects/${project.id}`} className="btn btn-info btn-sm me-2">
                    View
                  </Link>
                  <Link to={`/projects/${project.id}/edit`} className="btn btn-warning btn-sm">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'planning': return 'secondary';
    case 'active': return 'primary';
    case 'completed': return 'success';
    case 'on_hold': return 'warning';
    default: return 'info';
  }
};

export default ProjectList;
