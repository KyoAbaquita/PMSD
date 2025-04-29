import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setTask(response.data.task);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch task details');
        setLoading(false);
      }
    };
    
    fetchTaskDetails();
  }, [taskId]);
  
  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/api/tasks/${taskId}`,
        { ...task, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTask({ ...task, status: newStatus });
    } catch (err) {
      setError('Failed to update task status');
    }
  };
  
  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      navigate(`/projects/${task.project_id}/tasks`);
    } catch (err) {
      setError('Failed to delete task');
    }
  };
  
  if (loading) return <div>Loading task details...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!task) return <div>Task not found</div>;
  
  return (
    <div className="task-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{task.title}</h2>
        <div>
          <Link to={`/projects/${task.project_id}/tasks`} className="btn btn-secondary me-2">
            Back to Tasks
          </Link>
          <Link to={`/tasks/${taskId}/edit`} className="btn btn-warning me-2">
            Edit Task
          </Link>
          <button onClick={handleDeleteTask} className="btn btn-danger">
            Delete Task
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">Task Details</div>
            <div className="card-body">
              <p><strong>Description:</strong></p>
              <p>{task.description || 'No description provided'}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <p>
                    <strong>Project:</strong> {' '}
                    <Link to={`/projects/${task.project_id}`}>
                      {task.project?.name || `Project #${task.project_id}`}
                    </Link>
                  </p>
                  <p>
                    <strong>Status:</strong> {' '}
                    <span className={`badge bg-${getStatusBadge(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </p>
                  <p>
                    <strong>Priority:</strong> {' '}
                    <span className={`badge bg-${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Assigned To:</strong> {' '}
                    {task.assignedUser?.name || 'Unassigned'}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {' '}
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
                  </p>
                  <p>
                    <strong>Created:</strong> {' '}
                    {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">Update Status</div>
            <div className="card-body">
              <div className="d-flex gap-2">
                <button
                  className={`btn ${task.status === 'todo' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => handleStatusChange('todo')}
                >
                  To Do
                </button>
                <button
                  className={`btn ${task.status === 'in_progress' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleStatusChange('in_progress')}
                >
                  In Progress
                </button>
                <button
                  className={`btn ${task.status === 'review' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => handleStatusChange('review')}
                >
                  Review
                </button>
                <button
                  className={`btn ${task.status === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => handleStatusChange('completed')}
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
    case 'todo': return 'secondary';
    case 'in_progress': return 'primary';
    case 'review': return 'info';
    case 'completed': return 'success';
    default: return 'light';
  }
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'low': return 'success';
    case 'medium': return 'info';
    case 'high': return 'warning';
    case 'urgent': return 'danger';
    default: return 'secondary';
  }
};

export default TaskDetail;
