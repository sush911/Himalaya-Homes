import React, { useEffect, useState } from "react";
import { fetchPropertyRequests, approveRequest, rejectRequest, deleteProperty, deletePropertyRequest } from "../api/property";
import { NavLink } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiCheckCircle, FiXCircle, FiImage, FiVideo, FiMapPin, FiHome, FiCalendar, FiDollarSign, FiTrash2 } from 'react-icons/fi';
import "../styles/Admin.css";
import AdminLayout from "../components/AdminLayout";
import { useLanguage } from "../context/LanguageContext";

const AdminPanel = () => {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [message, setMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // Start with 6 items

  useEffect(() => {
    if (!token) return;
    loadRequests();
  }, [statusFilter, token]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        // Load more when near bottom
        setVisibleCount(prev => Math.min(prev + 6, requests.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [requests.length]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await fetchPropertyRequests(statusFilter, token);
      setRequests(res.data || []);
      setVisibleCount(6); // Reset to 6 when filter changes
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

  const handleDelete = async (id) => {
    if (!confirm("Delete this property request permanently? This cannot be undone.")) return;
    try {
      await deletePropertyRequest(id, token);
      setMessage("deleted");
      loadRequests();
      setShowGallery(false);
      setShowDetailedView(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one property to delete");
      return;
    }
    if (!confirm(`Delete ${selectedIds.length} property request(s) permanently? This cannot be undone.`)) return;
    
    try {
      await Promise.all(selectedIds.map(id => deletePropertyRequest(id, token)));
      setMessage("deleted");
      setSelectedIds([]);
      loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || "Bulk delete failed");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === requests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map(r => r._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
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
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .admin-enhanced-card {
          animation: fadeIn 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          content-visibility: auto;
          contain-intrinsic-size: 0 600px;
        }
        .admin-enhanced-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(43, 91, 186, 0.15);
          border-color: #2B5BBA;
        }
        .card-image-container {
          position: relative;
          overflow: hidden;
          height: 280px;
          background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%);
        }
        .card-image-container img {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .admin-enhanced-card:hover .card-image-container img {
          transform: scale(1.08);
        }
        .status-badge-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          animation: slideDown 0.4s ease-out;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .badge-pending { background: rgba(255, 193, 7, 0.95); color: #856404; }
        .badge-approved { background: rgba(40, 167, 69, 0.95); color: #FFFFFF; }
        .badge-rejected { background: rgba(220, 53, 69, 0.95); color: #FFFFFF; }
        .price-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(30, 58, 95, 0.95);
          color: #FFFFFF;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          backdrop-filter: blur(10px);
          animation: slideDown 0.5s ease-out;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .card-content { padding: 24px; }
        .property-title {
          color: #1E3A5F;
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 12px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .property-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #F5F5F5;
          border-radius: 8px;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }
        .info-item:hover {
          background: #E8F0FE;
          transform: translateX(2px);
        }
        .info-item svg { color: #2B5BBA; flex-shrink: 0; }
        .info-label { color: #666; font-weight: 500; }
        .info-value { color: #333; font-weight: 600; margin-left: auto; }
        .location-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%);
          border-radius: 8px;
          margin-bottom: 16px;
          border-left: 3px solid #2B5BBA;
        }
        .location-banner svg { color: #2B5BBA; font-size: 1.1rem; }
        .location-text { color: #333; font-size: 0.9rem; font-weight: 500; flex: 1; }
        .action-buttons { display: flex; gap: 8px; margin-top: 16px; }
        .btn-enhanced {
          flex: 1;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-approve {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .btn-approve:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
          background: linear-gradient(135deg, #218838 0%, #1ba87d 100%);
        }
        .btn-reject {
          background: linear-gradient(135deg, #dc3545 0%, #e85d68 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        .btn-reject:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
          background: linear-gradient(135deg, #c82333 0%, #d64554 100%);
        }
        .btn-delete {
          background: linear-gradient(135deg, #6c757d 0%, #868e96 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }
        .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
          background: linear-gradient(135deg, #5a6268 0%, #6c757d 100%);
        }
        .btn-view-media {
          background: linear-gradient(135deg, #2B5BBA 0%, #4A7FDB 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }
        .btn-view-media:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(43, 91, 186, 0.4);
          background: linear-gradient(135deg, #1E3A5F 0%, #2B5BBA 100%);
        }
        .btn-outline-enhanced {
          background: white;
          border: 2px solid #2B5BBA;
          color: #2B5BBA;
        }
        .btn-outline-enhanced:hover {
          background: #2B5BBA;
          color: white;
          transform: translateY(-2px);
        }
        .filter-buttons {
          display: flex;
          gap: 12px;
          padding: 8px;
          background: #F5F5F5;
          border-radius: 12px;
          animation: fadeIn 0.4s ease-out;
        }
        .filter-btn {
          flex: 1;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          background: white;
          color: #666;
          position: relative;
          overflow: hidden;
        }
        .filter-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .filter-btn:hover::before { left: 100%; }
        .filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .filter-btn.active-pending {
          background: linear-gradient(135deg, #ffc107 0%, #ffcd38 100%);
          color: #856404;
          border-color: #ffc107;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }
        .filter-btn.active-approved {
          background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
          color: white;
          border-color: #28a745;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        .filter-btn.active-rejected {
          background: linear-gradient(135deg, #dc3545 0%, #e85d68 100%);
          color: white;
          border-color: #dc3545;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        .count-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.3);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-left: 6px;
          font-weight: 700;
        }
        .alert-enhanced {
          animation: slideDown 0.4s ease-out;
          border-radius: 10px;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 16px 20px;
        }
        .loading-spinner { animation: fadeIn 0.3s ease-out; }
        .spinner-border { width: 3rem; height: 3rem; border-width: 4px; }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          animation: fadeIn 0.5s ease-out;
        }
        .empty-state-icon { font-size: 4rem; color: #E0E0E0; margin-bottom: 20px; }
        .empty-state-text { color: #666; font-size: 1.1rem; font-weight: 500; }
        .modal-enhanced .modal-content {
          border-radius: 16px;
          border: none;
          overflow: hidden;
          animation: scaleIn 0.3s ease-out;
        }
        .modal-enhanced .modal-header {
          background: linear-gradient(135deg, #1E3A5F 0%, #2B5BBA 100%);
          color: white;
          padding: 20px 24px;
          border: none;
        }
        .modal-enhanced .modal-title { font-weight: 700; font-size: 1.3rem; }
        .modal-enhanced .btn-close { filter: brightness(0) invert(1); }
        .media-section { margin-bottom: 32px; animation: fadeIn 0.5s ease-out; }
        .media-section-title {
          color: #1E3A5F;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #E0E0E0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .media-count {
          background: #2B5BBA;
          color: white;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.85rem;
          margin-left: auto;
        }
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        .media-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          background: #F5F5F5;
        }
        .media-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .media-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .media-item:hover img { transform: scale(1.05); }
        .video-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .video-container video { border-radius: 12px; }
        .timestamp {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #999;
          font-size: 0.85rem;
          padding: 8px 12px;
          background: #F5F5F5;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .info-grid { grid-template-columns: 1fr; }
          .action-buttons { flex-direction: column; }
          .filter-buttons { flex-direction: column; }
          .card-image-container { height: 220px; }
        }
        
        /* Skeleton Loading Animation */
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton-image {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        /* Progressive Image Loading */
        .progressive-image {
          filter: blur(10px);
          transition: filter 0.3s ease-out;
        }
        .progressive-image.loaded {
          filter: blur(0);
        }
        
        /* Smooth Scroll */
        .admin-enhanced-card {
          will-change: transform;
        }
        
        /* Optimize animations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <AdminLayout
        title={"Property Requests"}
        controls={(
          <div className="filter-buttons">
            <button
              type="button"
              className={`filter-btn ${statusFilter === "pending" ? "active-pending" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              ⏳ Pending
              {statusFilter === "pending" && <span className="count-badge">{requests.length}</span>}
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "approved" ? "active-approved" : ""}`}
              onClick={() => setStatusFilter("approved")}
            >
              ✓ Approved
              {statusFilter === "approved" && <span className="count-badge">{requests.length}</span>}
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === "rejected" ? "active-rejected" : ""}`}
              onClick={() => setStatusFilter("rejected")}
            >
              ✕ Rejected
              {statusFilter === "rejected" && <span className="count-badge">{requests.length}</span>}
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                className="filter-btn"
                onClick={handleBulkDelete}
                style={{ background: 'linear-gradient(135deg, #dc3545 0%, #e85d68 100%)', color: 'white', marginLeft: 'auto' }}
              >
                <FiTrash2 size={16} /> Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>
        )}
      >
        {message && (
          <div className={`alert alert-enhanced alert-${message.includes("approved") ? "success" : message.includes("rejected") ? "danger" : "success"} alert-dismissible fade show`} role="alert">
            <strong>✓ Success!</strong> {message === "deleted" ? "Property request(s) deleted successfully" : message}
            <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
          </div>
        )}

        {requests.length > 0 && (
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={selectedIds.length === requests.length}
              onChange={toggleSelectAll}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label style={{ margin: 0, cursor: 'pointer', fontWeight: 500 }} onClick={toggleSelectAll}>
              Select All ({requests.length})
            </label>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5 loading-spinner">
            <div className="spinner-border text-primary" role="status" style={{ color: '#2B5BBA !important' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: '#666', fontWeight: 500 }}>Loading property requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              {statusFilter === "pending" ? "📋" : statusFilter === "approved" ? "✅" : "❌"}
            </div>
            <div className="empty-state-text">
              No {statusFilter} requests found.
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {requests.slice(0, visibleCount).map((req, index) => (
              <div key={req._id} className="col-12 col-xl-6" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="admin-enhanced-card" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(req._id)}
                      onChange={() => toggleSelect(req._id)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="card-image-container">
                    {req.media?.propertyPhotos?.[0] ? (
                      <>
                        {/* Skeleton placeholder */}
                        <div className="skeleton-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
                        <img
                          src={typeof req.media.propertyPhotos[0] === 'object' ? req.media.propertyPhotos[0].thumbnail : req.media.propertyPhotos[0]}
                          alt={req.title}
                          loading="lazy"
                          decoding="async"
                          className="progressive-image"
                          onLoad={(e) => {
                            e.target.style.opacity = 1;
                            e.target.classList.add('loaded');
                            // Hide skeleton
                            const skeleton = e.target.previousElementSibling;
                            if (skeleton) skeleton.style.display = 'none';
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="d-flex align-items-center justify-content-center h-100"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="48" width="48" style="color: #ccc;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>';
                          }}
                          style={{ opacity: 0, transition: 'opacity 0.3s ease-out' }}
                        />
                      </>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <FiImage size={48} color="#ccc" />
                      </div>
                    )}
                    <div className={`status-badge-overlay badge-${req.status}`}>
                      {req.status === "pending" && "⏳ Pending Review"}
                      {req.status === "approved" && "✓ Approved"}
                      {req.status === "rejected" && "✕ Rejected"}
                    </div>
                    <div className="price-tag">
                      <span style={{ fontSize: '16px', display: 'inline', marginRight: '4px' }}>रु</span>  {/* Nepali word for Rupee */}
                      Rs {req.price?.toLocaleString() || "N/A"}
                    </div>
                  </div>

                  <div className="card-content">
                    <h5 className="property-title">{req.title}</h5>
                    <p className="property-description">{req.description}</p>

                    <div className="location-banner">
                      <FiMapPin />
                      <span className="location-text">
                        {req.location?.address}, {req.location?.city}, {req.location?.state || req.location?.province}
                      </span>
                    </div>

                    <div className="info-grid">
                      <div className="info-item">
                        <FiHome size={16} />
                        <span className="info-label">Type</span>
                        <span className="info-value">{req.propertyType}</span>
                      </div>
                      <div className="info-item">
                        <span style={{ fontSize: '16px' }}>🏷️</span>
                        <span className="info-label">Listing</span>
                        <span className="info-value">{req.listingType === "sale" ? "Sale" : "Rent"}</span>
                      </div>
                      <div className="info-item">
                        <span style={{ fontSize: '16px' }}>🛏️</span>
                        <span className="info-label">Bedrooms</span>
                        <span className="info-value">{req.bedrooms || 0}</span>
                      </div>
                      <div className="info-item">
                        <span style={{ fontSize: '16px' }}>🚿</span>
                        <span className="info-label">Bathrooms</span>
                        <span className="info-value">{req.bathrooms || 0}</span>
                      </div>
                      <div className="info-item">
                        <span style={{ fontSize: '16px' }}>📐</span>
                        <span className="info-label">Area</span>
                        <span className="info-value">
                          {req.area?.sqft ? `${req.area.sqft} sqft` : 
                           req.area?.ana ? `${req.area.ana} Ana` :
                           req.area?.ropani ? `${req.area.ropani} Ropani` : "N/A"}
                        </span>
                      </div>
                      <div className="info-item">
                        <FiCalendar size={16} />
                        <span className="info-label">Year</span>
                        <span className="info-value">{req.constructionYear || "N/A"}</span>
                      </div>
                    </div>

                    <div className="timestamp">
                      <FiCalendar size={14} />
                      <span>Submitted: {formatDate(req.createdAt)}</span>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="btn btn-enhanced btn-view-media"
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowDetailedView(true);
                        }}
                        style={{ background: 'linear-gradient(135deg, #4A7FDB 0%, #2B5BBA 100%)' }}
                      >
                        📋 Full Details
                      </button>
                      <button
                        className="btn btn-enhanced btn-view-media"
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowGallery(true);
                        }}
                      >
                        <FiImage size={16} /> View Media
                      </button>
                      <button
                        className="btn btn-enhanced btn-delete"
                        onClick={() => handleDelete(req._id)}
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                    </div>

                    {req.status === "pending" && (
                      <div className="action-buttons mt-2">
                        <button
                          className="btn btn-enhanced btn-approve"
                          onClick={() => handleApprove(req._id)}
                        >
                          <FiCheckCircle size={18} /> Approve
                        </button>
                        <button
                          className="btn btn-enhanced btn-reject"
                          onClick={() => handleReject(req._id)}
                        >
                          <FiXCircle size={18} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Indicator */}
        {!loading && requests.length > visibleCount && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
              <span className="visually-hidden">Loading more...</span>
            </div>
            <p style={{ marginTop: '12px', color: '#666', fontWeight: 500 }}>
              Showing {visibleCount} of {requests.length} properties
            </p>
          </div>
        )}

        {showGallery && selectedRequest && (
          <div
            className="modal fade show modal-enhanced"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setShowGallery(false)}
          >
            <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <FiImage size={24} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                    {selectedRequest.title}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowGallery(false)}
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: '24px' }}>
                  {selectedRequest.media?.propertyPhotos?.length > 0 && (
                    <div className="media-section">
                      <h6 className="media-section-title">
                        <FiImage size={20} />
                        Property Photos
                        <span className="media-count">{selectedRequest.media.propertyPhotos.length}</span>
                      </h6>
                      <div className="media-grid">
                        {selectedRequest.media.propertyPhotos.slice(0, 6).map((url, idx) => (
                          <div key={idx} className="media-item">
                            <div className="skeleton-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}></div>
                            <img 
                              src={typeof url === 'object' ? url.thumbnail : url} 
                              alt={`Property ${idx + 1}`} 
                              loading="lazy"
                              className="progressive-image"
                              onLoad={(e) => {
                                e.target.classList.add('loaded');
                                const skeleton = e.target.previousElementSibling;
                                if (skeleton) skeleton.style.display = 'none';
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                console.error('Failed to load image:', url);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {selectedRequest.media.propertyPhotos.length > 6 && (
                        <div style={{ textAlign: 'center', marginTop: '12px' }}>
                          <small style={{ color: '#666' }}>Showing 6 of {selectedRequest.media.propertyPhotos.length} photos (limited for performance)</small>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRequest.media?.lalpurjaPhotos?.length > 0 && (
                    <div className="media-section">
                      <h6 className="media-section-title">
                        📄 Lalpurja Documents
                        <span className="media-count">{selectedRequest.media.lalpurjaPhotos.length}</span>
                      </h6>
                      <div className="media-grid">
                        {selectedRequest.media.lalpurjaPhotos.slice(0, 4).map((url, idx) => (
                          <div key={idx} className="media-item">
                            <div className="skeleton-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}></div>
                            <img 
                              src={typeof url === 'object' ? url.thumbnail : url} 
                              alt={`Lalpurja ${idx + 1}`} 
                              loading="lazy"
                              className="progressive-image"
                              onLoad={(e) => {
                                e.target.classList.add('loaded');
                                const skeleton = e.target.previousElementSibling;
                                if (skeleton) skeleton.style.display = 'none';
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                console.error('Failed to load image:', url);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRequest.media?.propertyVideos?.length > 0 && (
                    <div className="media-section">
                      <h6 className="media-section-title">
                        <FiVideo size={20} />
                        Property Videos
                        <span className="media-count">{selectedRequest.media.propertyVideos.length}</span>
                      </h6>
                      <div className="row g-3">
                        {selectedRequest.media.propertyVideos.map((url, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="video-container">
                              <video controls preload="none" className="w-100 rounded" style={{ maxHeight: "400px", background: '#000' }}>
                                <source src={typeof url === 'object' ? url.original : url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRequest.media?.roadPhotos?.length > 0 && (
                    <div className="media-section">
                      <h6 className="media-section-title">
                        🛣️ Road Photos
                        <span className="media-count">{selectedRequest.media.roadPhotos.length}</span>
                      </h6>
                      <div className="media-grid">
                        {selectedRequest.media.roadPhotos.slice(0, 6).map((url, idx) => (
                          <div key={idx} className="media-item">
                            <div className="skeleton-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px' }}></div>
                            <img 
                              src={typeof url === 'object' ? url.thumbnail : url} 
                              alt={`Road ${idx + 1}`} 
                              loading="lazy"
                              className="progressive-image"
                              onLoad={(e) => {
                                e.target.classList.add('loaded');
                                const skeleton = e.target.previousElementSibling;
                                if (skeleton) skeleton.style.display = 'none';
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                console.error('Failed to load image:', url);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRequest.media?.roadVideos?.length > 0 && (
                    <div className="media-section">
                      <h6 className="media-section-title">
                        <FiVideo size={20} />
                        Road Videos
                        <span className="media-count">{selectedRequest.media.roadVideos.length}</span>
                      </h6>
                      <div className="row g-3">
                        {selectedRequest.media.roadVideos.map((url, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="video-container">
                              <video controls preload="none" className="w-100 rounded" style={{ maxHeight: "400px", background: '#000' }}>
                                <source src={typeof url === 'object' ? url.original : url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
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
                <div className="modal-footer" style={{ padding: '16px 24px', background: '#F5F5F5', borderTop: '1px solid #E0E0E0' }}>
                  {selectedRequest.status === "pending" && (
                    <>
                      <button
                        className="btn btn-enhanced btn-approve"
                        onClick={() => {
                          handleApprove(selectedRequest._id);
                          setShowGallery(false);
                        }}
                      >
                        <FiCheckCircle size={18} /> Approve Property
                      </button>
                      <button
                        className="btn btn-enhanced btn-reject"
                        onClick={() => {
                          handleReject(selectedRequest._id);
                          setShowGallery(false);
                        }}
                      >
                        <FiXCircle size={18} /> Reject Property
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="btn btn-enhanced btn-outline-enhanced"
                    onClick={() => setShowGallery(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDetailedView && selectedRequest && (
          <div
            className="modal fade show modal-enhanced"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={() => setShowDetailedView(false)}
          >
            <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    📋 Complete Property Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDetailedView(false)}
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: '24px' }}>
                  {/* Property Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #2B5BBA 100%)',
                    color: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{ marginBottom: '12px' }}>{selectedRequest.title}</h3>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', marginRight: '4px' }}>रु</span>
                      Rs {selectedRequest.price?.toLocaleString() || "N/A"}
                    </div>
                    <small style={{ opacity: 0.9 }}>Status: <span style={{ 
                      textTransform: 'capitalize',
                      background: 'rgba(255,255,255,0.2)',
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}>{selectedRequest.status}</span></small>
                  </div>

                  {/* Description Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
                      📝 Description
                    </h6>
                    <div style={{
                      background: '#F5F5F5',
                      padding: '16px',
                      borderRadius: '10px',
                      lineHeight: '1.6',
                      color: '#333'
                    }}>
                      {selectedRequest.description || "No description provided"}
                    </div>
                  </div>

                  {/* Location Section */}
                  <div style={{ marginBottom: '24px' }}>
                    <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
                      📍 Location
                    </h6>
                    <div style={{
                      background: '#F5F5F5',
                      padding: '16px',
                      borderRadius: '10px'
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Address:</strong> {selectedRequest.location?.address || "N/A"}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>City:</strong> {selectedRequest.location?.city || "N/A"}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>State/Province:</strong> {selectedRequest.location?.state || selectedRequest.location?.province || "N/A"}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Country:</strong> {selectedRequest.location?.country || "N/A"}
                      </div>
                      {selectedRequest.location?.zipCode && (
                        <div>
                          <strong>Zip Code:</strong> {selectedRequest.location.zipCode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map Section */}
                  {selectedRequest.location?.coordinates?.lat && selectedRequest.location?.coordinates?.lng && (
                    <div style={{ marginBottom: '24px' }}>
                      <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
                        🗺️ Map Location
                      </h6>
                      <div style={{
                        background: '#F5F5F5',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        marginBottom: '12px'
                      }}>
                        <iframe
                          width="100%"
                          height="300"
                          frameBorder="0"
                          style={{ border: 'none' }}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedRequest.location.coordinates.lng-0.01},${selectedRequest.location.coordinates.lat-0.01},${selectedRequest.location.coordinates.lng+0.01},${selectedRequest.location.coordinates.lat+0.01}&layer=mapnik&marker=${selectedRequest.location.coordinates.lat},${selectedRequest.location.coordinates.lng}`}
                        ></iframe>
                      </div>
                      <small style={{ color: '#666' }}>
                        Coordinates: {selectedRequest.location.coordinates.lat.toFixed(6)}, {selectedRequest.location.coordinates.lng.toFixed(6)}
                      </small>
                    </div>
                  )}

                  {/* Property Details Grid */}
                  <div style={{ marginBottom: '24px' }}>
                    <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
                      🏠 Property Details
                    </h6>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Property Type</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                          {selectedRequest.propertyType || "N/A"}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Listing Type</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                          {selectedRequest.listingType === "sale" ? "Sale" : "Rent"}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Bedrooms</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem' }}>
                          {selectedRequest.bedrooms || 0}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Bathrooms</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem' }}>
                          {selectedRequest.bathrooms || 0}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Floors</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem' }}>
                          {selectedRequest.floors || "N/A"}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Parking Spaces</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem' }}>
                          {selectedRequest.parking || 0}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Construction Year</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem' }}>
                          {selectedRequest.constructionYear || "N/A"}
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                        padding: '16px',
                        borderRadius: '10px',
                        borderLeft: '4px solid #2B5BBA'
                      }}>
                        <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '4px' }}>Area</div>
                        <div style={{ color: '#1E3A5F', fontWeight: '700', fontSize: '1.1rem' }}>
                          {selectedRequest.area?.sqft ? `${selectedRequest.area.sqft} sqft` :
                           selectedRequest.area?.ana ? `${selectedRequest.area.ana} Ana` :
                           selectedRequest.area?.ropani ? `${selectedRequest.area.ropani} Ropani` : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Section */}
                  {selectedRequest.amenities && selectedRequest.amenities.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
                        ✨ Amenities
                      </h6>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {selectedRequest.amenities.map((amenity, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'linear-gradient(135deg, #E8F0FE 0%, #D0E4FF 100%)',
                              padding: '10px 16px',
                              borderRadius: '20px',
                              color: '#2B5BBA',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}
                          >
                            ✓ {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nearby Facilities Section */}
                  {(selectedRequest.nearby?.education?.length > 0 || 
                    selectedRequest.nearby?.food?.length > 0 || 
                    selectedRequest.nearby?.health?.length > 0) && (
                    <div style={{ marginBottom: '24px' }}>
                      <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
                        🏢 Nearby Facilities
                      </h6>

                      {selectedRequest.nearby?.education?.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <h6 style={{ color: '#2B5BBA', marginBottom: '8px', fontWeight: '600' }}>🎓 Education</h6>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            {selectedRequest.nearby.education.map((item, idx) => (
                              <div key={idx} style={{
                                background: '#F5F5F5',
                                padding: '12px',
                                borderRadius: '8px',
                                borderLeft: '4px solid #2B5BBA'
                              }}>
                                <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{item.name}</div>
                                <small style={{ color: '#666' }}>
                                  {item.type} • {item.distanceKm?.toFixed(2)}km away
                                </small>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRequest.nearby?.food?.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <h6 style={{ color: '#2B5BBA', marginBottom: '8px', fontWeight: '600' }}>🍽️ Food & Dining</h6>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            {selectedRequest.nearby.food.map((item, idx) => (
                              <div key={idx} style={{
                                background: '#F5F5F5',
                                padding: '12px',
                                borderRadius: '8px',
                                borderLeft: '4px solid #2B5BBA'
                              }}>
                                <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{item.name}</div>
                                <small style={{ color: '#666' }}>
                                  {item.type} • {item.distanceKm?.toFixed(2)}km away
                                </small>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRequest.nearby?.health?.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <h6 style={{ color: '#2B5BBA', marginBottom: '8px', fontWeight: '600' }}>🏥 Healthcare</h6>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            {selectedRequest.nearby.health.map((item, idx) => (
                              <div key={idx} style={{
                                background: '#F5F5F5',
                                padding: '12px',
                                borderRadius: '8px',
                                borderLeft: '4px solid #2B5BBA'
                              }}>
                                <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{item.name}</div>
                                <small style={{ color: '#666' }}>
                                  {item.type} • {item.distanceKm?.toFixed(2)}km away
                                </small>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submitted Info */}
                  <div style={{
                    background: '#F5F5F5',
                    padding: '16px',
                    borderRadius: '10px',
                    marginBottom: '24px',
                    borderLeft: '4px solid #2B5BBA'
                  }}>
                    <small style={{ color: '#666' }}>
                      <strong>Submitted by:</strong> {selectedRequest.postedBy?.name || "Unknown User"} • <strong>On:</strong> {formatDate(selectedRequest.createdAt)}
                    </small>
                  </div>

                  {/* Media Summary */}
                  <div style={{
                    background: 'linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%)',
                    padding: '16px',
                    borderRadius: '10px',
                    marginBottom: '24px'
                  }}>
                    <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px' }}>📸 Media Summary</h6>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</div>
                        <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{selectedRequest.media?.propertyPhotos?.length || 0}</div>
                        <small style={{ color: '#666' }}>Property Photos</small>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📹</div>
                        <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{selectedRequest.media?.propertyVideos?.length || 0}</div>
                        <small style={{ color: '#666' }}>Property Videos</small>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🛣️</div>
                        <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{selectedRequest.media?.roadPhotos?.length || 0}</div>
                        <small style={{ color: '#666' }}>Road Photos</small>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🛣️📹</div>
                        <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{selectedRequest.media?.roadVideos?.length || 0}</div>
                        <small style={{ color: '#666' }}>Road Videos</small>
                      </div>
                      <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📄</div>
                        <div style={{ fontWeight: '600', color: '#1E3A5F' }}>{selectedRequest.media?.lalpurjaPhotos?.length || 0}</div>
                        <small style={{ color: '#666' }}>Lalpurja Docs</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #E0E0E0' }}>
                  {selectedRequest.status === "pending" && (
                    <>
                      <button
                        className="btn btn-enhanced btn-approve"
                        onClick={() => {
                          handleApprove(selectedRequest._id);
                          setShowDetailedView(false);
                        }}
                      >
                        <FiCheckCircle size={18} /> Approve Property
                      </button>
                      <button
                        className="btn btn-enhanced btn-reject"
                        onClick={() => {
                          handleReject(selectedRequest._id);
                          setShowDetailedView(false);
                        }}
                      >
                        <FiXCircle size={18} /> Reject Property
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="btn btn-enhanced btn-outline-enhanced"
                    onClick={() => setShowDetailedView(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default AdminPanel;

