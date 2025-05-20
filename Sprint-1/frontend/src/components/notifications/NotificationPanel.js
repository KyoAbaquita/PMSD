import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api"; 
import axios from "axios";

const NotificationPanel = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE_URL}/notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const newData = response.data;
        setActivities((prev) => {
          const newIds = newData
            .filter((item) => !prev.some((existing) => existing.id === item.id))
            .map((item) => item.id);

          setHighlightedIds(newIds);
          return newData;
        });
      } catch (err) {
        setError("Failed to load notifications.");
      }
    };

    fetchNotifications(); // initial load

    const interval = setInterval(fetchNotifications, 5000); // poll every 5s

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-header">Recent Activity</div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {activities.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          <ul className="list-group">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className={`list-group-item ${
                  highlightedIds.includes(activity.id)
                    ? "bg-success bg-opacity-10"
                    : ""
                }`}
              >
                <div>
                  <strong>
                    {activity.user?.name || "Unknown"} – {activity.description}
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
  );
};

export default NotificationPanel;
