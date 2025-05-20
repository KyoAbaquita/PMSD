import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";
import { Link, useLocation } from "react-router-dom";
import { Bell } from "react-feather";
import axios from "axios";

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        if (data.length > notifications.length) {
          setHasNew(true);
        }
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications.");
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [notifications.length]);

  const toggleModal = () => {
    setShowModal(!showModal);
    setHasNew(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            Klick Inc. PMS
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            {/* LEFT SIDE NAV LINKS */}
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  to="/"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname.includes("/projects") ? "active" : ""
                  }`}
                  to="/projects"
                >
                  Projects
                </Link>
              </li>
            </ul>

            {/* RIGHT SIDE ACTIONS */}
            <div className="ms-lg-auto w-100 w-lg-auto">
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-end gap-2 text-white mt-3 mt-lg-0">
                <div className="position-relative">
                  <button
                    className="btn btn-outline-light btn-sm position-relative"
                    onClick={toggleModal}
                  >
                    <Bell />
                    {hasNew && (
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                    )}
                  </button>
                </div>
                <div>
                  Welcome, <strong>{user?.name || "User"}</strong>
                </div>
                <div>
                  <button
                    onClick={onLogout}
                    className="btn btn-outline-light btn-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          onClick={toggleModal}
        >
          <div
            className="modal-dialog modal-dialog-scrollable"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Recent Activity</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleModal}
                ></button>
              </div>
              <div className="modal-body">
                {notifications.length === 0 ? (
                  <p>No recent activity.</p>
                ) : (
                  <ul className="list-group">
                    {notifications.map((activity) => (
                      <li key={activity.id} className="list-group-item">
                        <div>
                          <strong>
                            {activity.user?.name || "Unknown"} –{" "}
                            {activity.description}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {new Date(activity.created_at).toLocaleString()}
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
