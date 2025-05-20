import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../api";
import axios from "axios";

const ProjectMembers = () => {
  const { id } = useParams(); // project ID
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [creatorId, setCreatorId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const isOwner = currentUserId === creatorId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [membersRes, usersRes, projectRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/projects/${id}/members`, {
            headers,
          }),
          axios.get(`${API_BASE_URL}/users`, { headers }),
          axios.get(`${API_BASE_URL}/projects/${id}`, { headers }),
        ]);

        setMembers(membersRes.data.members);
        setAllUsers(usersRes.data.users);
        const project = projectRes.data.project;
        setProjectName(project.name);
        setCreatorId(project.user_id);
        const userRes = await axios.get(`${API_BASE_URL}/user`, {
          headers,
        });
        setCurrentUserId(userRes.data.id);
        setLoading(false);
      } catch (err) {
        setError("Failed to load project members.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddMember = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/projects/${id}/members`,
        { user_id: selectedUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedUser("");
      // Re-fetch after add
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const membersRes = await axios.get(
        `${API_BASE_URL}/projects/${id}/members`,
        { headers }
      );
      setMembers(membersRes.data.members);
    } catch (err) {
      alert("Failed to add user. Maybe already a member?");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/projects/${id}/members/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Re-fetch after removal
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const membersRes = await axios.get(
        `${API_BASE_URL}/projects/${id}/members`,
        { headers }
      );
      setMembers(membersRes.data.members);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to remove user.";
      alert(errorMessage);
    }
  };

  const availableUsers = allUsers.filter(
    (user) => !members.some((member) => member.id === user.id)
  );

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
          <div className="mt-2">Loading Project Members...</div>
        </div>
      </div>
    );
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="project-members">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Members of "{projectName}"</h2>
        <Link to={`/projects/${id}`} className="btn btn-secondary">
          Back to Project
        </Link>
      </div>
      {!isOwner && (
        <div className="alert alert-info mt-3">
          You can view the members, but only the project owner can add or remove
          them.
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">Add Member</div>
        <div className="card-body d-flex gap-2 align-items-center">
          <select
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {isOwner && (
            <button
              onClick={handleAddMember}
              className="btn btn-primary"
              disabled={!selectedUser}
            >
              Add
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">Current Members</div>
        <ul className="list-group list-group-flush">
          {members.map((member) => (
            <li
              key={member.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {member.name} ({member.email}){" "}
                {member.id === creatorId && (
                  <span className="badge bg-primary ms-2">Owner</span>
                )}
              </span>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemoveMember(member.id)}
                disabled={!isOwner || member.id === creatorId}
              >
                Remove
              </button>
            </li>
          ))}
          {members.length === 0 && (
            <li className="list-group-item">No members yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectMembers;
