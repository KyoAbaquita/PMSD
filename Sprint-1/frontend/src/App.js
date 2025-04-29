// f-end/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Register from './components/registration';
import ProjectList from './components/projects/ProjectList';
import ProjectForm from './components/projects/ProjectForm';
import ProjectDetail from './components/projects/ProjectDetail';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import TaskDetail from './components/tasks/TaskDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  
  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };
  
  return (
    <Router>
      <div className="App">
      {isAuthenticated && <Navigation />}
      <div className="container py-4">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Project routes */}
          <Route 
            path="/projects" 
            element={isAuthenticated ? <ProjectList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/projects/create" 
            element={isAuthenticated ? <ProjectForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/projects/:id" 
            element={isAuthenticated ? <ProjectDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/projects/:id/edit" 
            element={isAuthenticated ? <ProjectForm /> : <Navigate to="/login" />} 
          />
          
          {/* Task routes */}
          <Route 
            path="/projects/:projectId/tasks" 
            element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/projects/:projectId/tasks/create" 
            element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks" 
            element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/:taskId" 
            element={isAuthenticated ? <TaskDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/:taskId/edit" 
            element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;