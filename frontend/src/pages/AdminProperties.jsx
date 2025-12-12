import React, { useEffect, useState } from "react";
import { getAllProperties, deleteProperty } from "../api/property";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Properties</h2>
        <Link to="/admin" className="btn btn-outline-primary">
          Back to Requests
        </Link>
      </div>

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
              <div className="card">
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
                  <div className="d-flex gap-2">
                    <Link to={`/property/${prop._id}`} className="btn btn-sm btn-outline-primary">
                      View
                    </Link>
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
    </div>
  );
};

export default AdminProperties;

