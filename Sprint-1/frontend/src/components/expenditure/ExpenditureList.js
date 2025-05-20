import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../api";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ExpenditureList = () => {
  const { id } = useParams(); // project ID
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOwner, setCheckingOwner] = useState(true);

  const fetchExpenditures = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const projectRes = await axios.get(
        `${API_BASE_URL}/projects/${id}`,
        { headers }
      );

      const userRes = await axios.get(`${API_BASE_URL}/user`, {
        headers,
      });
      const userId = userRes.data.id;
      const isOwnerMatch = projectRes.data.project.user_id === userId;

      if (!isOwnerMatch) {
        setError("You are not authorized to view this page.");
        setCheckingOwner(false);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/projects/${id}/expenditures`,
        { headers }
      );
      setExpenditures(response.data);

      setLoading(false);
      setCheckingOwner(false);
    } catch (err) {
      setError("Failed to load expenditures or verify ownership.");
      setLoading(false);
      setCheckingOwner(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpenditures();
  }, [fetchExpenditures]);

  const handleDelete = async (expenditureId) => {
    if (!window.confirm("Are you sure you want to delete this expenditure?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/expenditures/${expenditureId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenditures((prev) => prev.filter((exp) => exp.id !== expenditureId));
    } catch (err) {
      alert("Failed to delete expenditure.");
    }
  };

  if (checkingOwner || loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <div>Checking access...</div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Expenditure Records</h3>
        <div>
          <Link
            to={`/projects/${id}`}
            className="btn btn-outline-secondary me-2"
          >
            Back to Project
          </Link>
          <Link
            to={`/projects/${id}/expenditures/add`}
            className="btn btn-success"
          >
            Record New Expenditure
          </Link>
        </div>
      </div>

      {expenditures.length === 0 ? (
        <p>No expenditures recorded for this project.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Amount (₱)</th>
                <th>Description</th>
                <th>Date</th>
                <th style={{ width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenditures.map((exp, index) => (
                <tr key={exp.id}>
                  <td>{index + 1}</td>
                  <td>{Number(exp.amount).toFixed(2)}</td>
                  <td>{exp.description}</td>
                  <td>{new Date(exp.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(exp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenditureList;
