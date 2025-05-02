import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Kuya Koy's PMS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.includes('/projects') ? 'active' : ''}`}
                to="/projects"
              >
                Projects
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname.includes('/tasks') && !location.pathname.includes('/projects') ? 'active' : ''}`}
                to="/tasks"
              >
                Tasks
              </Link>
            </li> */}
          </ul>

          <div className="d-flex align-items-center gap-3 text-white">
            <span className="fw-light">Welcome, <strong>{user?.name}</strong></span>
            <button onClick={onLogout} className="btn btn-outline-light btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
