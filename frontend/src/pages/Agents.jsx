import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AgentsOverride.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/agents/public`);
        setAgents(res.data || []);
      } catch (err) {
        console.error(err);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Our Agents</h2>
          <p className="text-muted">Trusted agents available to help you find the right property.</p>
        </div>
        <div>
          <Link to="/" className="btn btn-outline-secondary">Back Home</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      ) : agents.length === 0 ? (
        <div className="alert alert-info">No agents available at the moment.</div>
      ) : (
        <div className="row g-4">
          {agents.map((a) => (
            <div className="col-md-4" key={a._id}>
              <div className="card h-100 agent-cylinder">
                <div className="card-body d-flex flex-column align-items-center justify-content-between">
                  <div className="avatar-wrap">
                    <img src={a.photo || "/src/assets/profile.png"} alt={a.name} className="agent-avatar-centered" />
                  </div>

                  <div className="agent-info text-center mt-3 w-100">
                    <h5 className="mb-1">{a.name}</h5>
                    <p className="mb-1 small text-muted">{a.address || 'Address not provided'}</p>
                    <p className="mb-0 small text-muted">{a.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
