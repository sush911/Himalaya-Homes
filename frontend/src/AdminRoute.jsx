import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "./api/auth";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getMe(token);
        setIsAdmin(res.data.role === "admin");
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!token || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

