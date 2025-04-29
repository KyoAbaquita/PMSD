import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TaskForm = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!taskId;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: projectId || '',
    assigned_to: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
  });
  
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        
        // Fetch users for assignment
        const usersResponse = await axios.get('http://localhost:8000/api/users', { headers });
        setUsers(usersResponse.data.users);
        
        // Fetch projects for dropdown
        const projectsResponse = await axios.get('http://localhost:8000/api/projects', { headers });
        setProjects(projectsResponse.data.projects);
        
        // If editing, fetch task details
        if (isEditing) {
          const taskResponse = await axios.get(`http://localhost:8000/api/tasks/${taskId}`, { headers });
          const task = taskResponse.data.task;
          
          setFormData({
            title: task.title,
            description: task.description || '',
            project_id: task.project_id,
            assigned_to: task.assigned_to || '',
            status: task.status,
            priority: task.priority,
            due_date: task.due_date ? task.due_date.split('T')[0] : '',
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load form data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [taskId, projectId, isEditing]);
  
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
        ? `http://localhost:8000/api/tasks/${taskId}`
        : 'http://localhost:8000/api/tasks';
      
      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Navigate back to the project's task list
      navigate(`/projects/${formData.project_id}/tasks`);
    } catch (err) {
      setError('Failed to save task');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="task-form">
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Task Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
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
        
        <div className="mb-3">
          <label htmlFor="project_id" className="form-label">Project</label>
          <select
            className="form-select"
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            required
            disabled={!!projectId} // Disable if project ID is passed in URL
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="col">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              className="form-select"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="assigned_to" className="form-label">Assign To</label>
            <select
              className="form-select"
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col">
            <label htmlFor="due_date" className="form-label">Due Date</label>
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
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(`/projects/${formData.project_id}/tasks`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
