import React, { useEffect, useState } from "react";
import { getAllProperties, deleteProperty } from "../api/property";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout";

const AdminProperties = () => {
  const token = localStorage.getItem("token");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    loadProperties();
  }, [token]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await getAllProperties(token);
      setProperties(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    try {
      await deleteProperty(id, token);
      alert("Property deleted successfully!");
      loadProperties();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete property");
    }
  };

  return (
    <AdminLayout title={"All Properties"} controls={(
      <NavLink to="/admin" className="btn btn-outline-primary">Back to Requests</NavLink>
    )}>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="alert alert-info">No properties found.</div>
      ) : (
        <div className="row g-3">
          {properties.map((prop) => (
            <div className="col-md-6" key={prop._id}>
              <div className="card admin-card">
                <div className="card-body">
                  <h5 className="card-title">{prop.title}</h5>
                  <p className="mb-2">
                    <strong>Price:</strong> Rs {prop.price?.toLocaleString()} | <strong>Type:</strong> {prop.propertyType} | <strong>Listing:</strong> {prop.listingType}
                  </p>
                  <p className="mb-2">
                    <strong>Location:</strong> {prop.location?.address}, {prop.location?.city}
                  </p>
                  {prop.postedBy && (
                    <p className="mb-2 small text-muted">
                      Posted by: {prop.postedBy.firstName} {prop.postedBy.lastName} ({prop.postedBy.email})
                    </p>
                  )}
                  {prop.reports && prop.reports.length > 0 && (
                    <div className="mb-2">
                      <strong>Reports:</strong>
                      <ul className="list-unstyled small mt-2">
                        {prop.reports.map((r) => (
                          <li key={r._id} className="mb-1">
                            <span className="badge bg-warning text-dark me-2">{r.reason}</span>
                            {r.user ? `${r.user.firstName} ${r.user.lastName} (${r.user.email})` : "Unknown user"}
                            <span className="text-muted ms-2">{new Date(r.createdAt).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="d-flex gap-2">
                    <NavLink to={`/property/${prop._id}`} className="btn btn-sm btn-outline-primary">
                      View
                    </NavLink>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(prop._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProperties;

