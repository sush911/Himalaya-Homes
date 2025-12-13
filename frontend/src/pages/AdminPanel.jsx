import React, { useEffect, useState } from "react";
import { fetchPropertyRequests, approveRequest, rejectRequest, deleteProperty } from "../api/property";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { NavLink } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import "../styles/Admin.css";
import AdminLayout from "../components/AdminLayout";

const AdminPanel = () => {
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [message, setMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (!token) return;
    loadRequests();
  }, [statusFilter, token]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await fetchPropertyRequests(statusFilter, token);
      setRequests(res.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm("Approve this property request? It will be posted to the appropriate page.")) return;
    try {
      await approveRequest(id, token);
      setMessage("Property approved successfully!");
      loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this property request?")) return;
    try {
      await rejectRequest(id, token);
      setMessage("Property rejected.");
      loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || "Rejection failed");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    try {
      await deleteProperty(propertyId, token);
      setMessage("Property deleted successfully!");
      loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete property");
    }
  };

  return (
    <AdminLayout
      title={"Property Requests"}
      controls={(
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${statusFilter === "pending" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending {statusFilter === "pending" && `(${requests.length})`}
          </button>
          <button
            type="button"
            className={`btn ${statusFilter === "approved" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setStatusFilter("approved")}
          >
            Approved {statusFilter === "approved" && `(${requests.length})`}
          </button>
          <button
            type="button"
            className={`btn ${statusFilter === "rejected" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected {statusFilter === "rejected" && `(${requests.length})`}
          </button>
        </div>
      )}
    >
      {message && (
        <div className={`alert alert-${message.includes("approved") ? "success" : "info"} alert-dismissible fade show`} role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <div className="alert alert-info">No {statusFilter} requests found.</div>
      ) : (
        <div className="row g-4">
          {requests.map((req) => (
            <div key={req._id} className="col-12 col-lg-6">
              <div className="card shadow-sm admin-card">
                <div className="row g-0">
                  <div className="col-md-4">
                    {req.media?.propertyPhotos?.[0] ? (
                      <img
                        src={req.media.propertyPhotos[0]}
                        className="card-img h-100"
                        alt={req.title}
                        style={{ objectFit: "cover", minHeight: "300px" }}
                      />
                    ) : (
                      <div className="card-img h-100 bg-light d-flex align-items-center justify-content-center">
                        <span className="text-muted">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card-body d-flex flex-column h-100">
                      <div>
                        <h5 className="card-title">{req.title}</h5>
                        <p className="card-text"><strong>Description:</strong> {req.description}</p>
                        <div className="row mb-2">
                          <div className="col-6">
                            <strong>Price:</strong> Rs {req.price?.toLocaleString() || "N/A"}
                          </div>
                          <div className="col-6">
                            <strong>Type:</strong> {req.propertyType} | {req.listingType === "sale" ? "Buy" : "Rent"}
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-6">
                            <strong>Bedrooms:</strong> {req.bedrooms || 0} | <strong>Bathrooms:</strong> {req.bathrooms || 0}
                          </div>
                          <div className="col-6">
                            <strong>Floors:</strong> {req.floors || 0} | <strong>Year:</strong> {req.constructionYear || "N/A"}
                          </div>
                        </div>
                        <div className="mb-2">
                          <strong>Area:</strong>{" "}
                          {req.area?.sqft && `${req.area.sqft} sq.ft`}
                          {req.area?.ana && ` | ${req.area.ana} Ana`}
                          {req.area?.ropani && ` | ${req.area.ropani} Ropani`}
                        </div>
                        <p className="card-text mb-2">
                          <strong>Location:</strong> {req.location?.address}, {req.location?.city}, {req.location?.state || req.location?.province}
                        </p>
                      </div>

                      <div className="mt-auto">
                        {req.media && (
                          <div className="mb-2 d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedRequest(req);
                                setShowGallery(true);
                              }}
                            >
                              View All Photos & Videos
                            </button>
                            <a href={`/property/${req._id}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary admin-action-btn">View on site</a>
                            <NavLink to="/admin/properties" className="btn btn-sm btn-outline-primary admin-action-btn">Open Properties</NavLink>
                          </div>
                        )}

                        <p className="card-text text-muted small mb-2">
                          <strong>Submitted:</strong> {formatDate(req.createdAt)}
                        </p>

                        <div className="d-flex gap-2">
                          {req.status === "pending" && (
                            <>
                              <button
                                className="btn btn-success btn-sm flex-fill d-flex align-items-center justify-content-center"
                                onClick={() => handleApprove(req._id)}
                              >
                                <FiCheckCircle style={{ marginRight: 8 }} /> Approve
                              </button>
                              <button
                                className="btn btn-danger btn-sm flex-fill d-flex align-items-center justify-content-center"
                                onClick={() => handleReject(req._id)}
                              >
                                <FiXCircle style={{ marginRight: 8 }} /> Reject
                              </button>
                            </>
                          )}
                          {req.status === "approved" && (
                            <span className="badge bg-success w-100 admin-badge d-flex align-items-center"><FiCheckCircle style={{ marginRight: 8 }} /> Approved</span>
                          )}
                          {req.status === "rejected" && (
                            <span className="badge bg-danger w-100 admin-badge d-flex align-items-center"><FiXCircle style={{ marginRight: 8 }} /> Rejected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Gallery Modal */}
      {showGallery && selectedRequest && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowGallery(false)}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Media Gallery - {selectedRequest.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowGallery(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Lalpurja Photos */}
                {selectedRequest.media?.lalpurjaPhotos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Lalpurja Photos ({selectedRequest.media.lalpurjaPhotos.length})</h6>
                    <div className="row g-2">
                      {selectedRequest.media.lalpurjaPhotos.map((url, idx) => (
                        <div key={idx} className="col-md-3">
                          <img src={url} className="img-fluid rounded" alt={`Lalpurja ${idx + 1}`} style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Photos */}
                {selectedRequest.media?.propertyPhotos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Property Photos ({selectedRequest.media.propertyPhotos.length})</h6>
                    <div className="row g-2">
                      {selectedRequest.media.propertyPhotos.map((url, idx) => (
                        <div key={idx} className="col-md-3">
                          <img src={url} className="img-fluid rounded" alt={`Property ${idx + 1}`} style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Videos */}
                {selectedRequest.media?.propertyVideos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Property Videos ({selectedRequest.media.propertyVideos.length})</h6>
                    <div className="row g-2">
                      {selectedRequest.media.propertyVideos.map((url, idx) => (
                        <div key={idx} className="col-md-6">
                          <video controls className="w-100 rounded" style={{ maxHeight: "400px" }}>
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Road Photos */}
                {selectedRequest.media?.roadPhotos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Road Photos ({selectedRequest.media.roadPhotos.length})</h6>
                    <div className="row g-2">
                      {selectedRequest.media.roadPhotos.map((url, idx) => (
                        <div key={idx} className="col-md-3">
                          <img src={url} className="img-fluid rounded" alt={`Road ${idx + 1}`} style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Road Videos */}
                {selectedRequest.media?.roadVideos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Road Videos ({selectedRequest.media.roadVideos.length})</h6>
                    <div className="row g-2">
                      {selectedRequest.media.roadVideos.map((url, idx) => (
                        <div key={idx} className="col-md-6">
                          <video controls className="w-100 rounded" style={{ maxHeight: "400px" }}>
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!selectedRequest.media || 
                  (!selectedRequest.media.lalpurjaPhotos?.length && 
                   !selectedRequest.media.propertyPhotos?.length && 
                   !selectedRequest.media.propertyVideos?.length &&
                   !selectedRequest.media.roadPhotos?.length &&
                   !selectedRequest.media.roadVideos?.length)) && (
                  <div className="alert alert-info">No media files available.</div>
                )}
              </div>
              <div className="modal-footer">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        handleApprove(selectedRequest._id);
                        setShowGallery(false);
                      }}
                    >
                      Approve Property
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleReject(selectedRequest._id);
                        setShowGallery(false);
                      }}
                    >
                      Reject Property
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowGallery(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPanel;

