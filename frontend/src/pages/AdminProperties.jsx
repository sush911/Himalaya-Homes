import React, { useEffect, useState } from "react";
import { getAllProperties, deleteProperty } from "../api/property";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiTrash2, FiEye, FiAlertTriangle, FiMapPin, FiDollarSign, FiHome, FiUser } from 'react-icons/fi';
import AdminLayout from "../components/AdminLayout";
import { useLanguage } from "../context/LanguageContext";

const AdminProperties = () => {
  const { t } = useLanguage();
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
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .properties-enhanced-card {
          animation: fadeInUp 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          overflow: hidden;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .properties-enhanced-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(43, 91, 186, 0.18);
          border-color: #2B5BBA;
        }

        .property-card-header {
          padding: 20px;
          border-bottom: 2px solid #F5F5F5;
        }

        .property-card-body {
          padding: 20px;
        }

        .property-title-enhanced {
          color: #1E3A5F;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .property-info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .property-info-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #F5F5F5 0%, #E8F0FE 100%);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #333;
          transition: all 0.2s ease;
        }

        .property-info-badge:hover {
          background: linear-gradient(135deg, #E8F0FE 0%, #D0E4FF 100%);
          transform: translateY(-2px);
        }

        .property-info-badge svg {
          color: #2B5BBA;
        }

        .property-location-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          background: linear-gradient(135deg, #E8F0FE 0%, #F5F5F5 100%);
          border-radius: 10px;
          margin-bottom: 16px;
          border-left: 4px solid #2B5BBA;
        }

        .property-location-banner svg {
          color: #2B5BBA;
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .property-location-text {
          color: #333;
          font-size: 0.9rem;
          font-weight: 500;
          line-height: 1.5;
        }

        .posted-by-section {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #F5F5F5;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .posted-by-section svg {
          color: #666;
          font-size: 1.1rem;
        }

        .posted-by-text {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.4;
        }

        .posted-by-name {
          font-weight: 600;
          color: #333;
        }

        .reports-section {
          background: linear-gradient(135deg, #FFF3CD 0%, #FFECB5 100%);
          border-left: 4px solid #FFC107;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 16px;
          animation: slideIn 0.4s ease-out;
        }

        .reports-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #856404;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .reports-header svg {
          animation: pulse 2s infinite;
        }

        .report-item {
          background: rgba(255, 255, 255, 0.8);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .report-item:last-child {
          margin-bottom: 0;
        }

        .report-item:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateX(4px);
        }

        .report-reason-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background: #FFC107;
          color: #856404;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-right: 8px;
        }

        .report-user-info {
          font-size: 0.85rem;
          color: #666;
          margin-top: 4px;
        }

        .report-date {
          font-size: 0.75rem;
          color: #999;
          margin-top: 4px;
        }

        .property-actions {
          display: flex;
          gap: 10px;
          padding-top: 16px;
          border-top: 2px solid #F5F5F5;
        }

        .btn-view-enhanced {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid #2B5BBA;
          background: white;
          color: #2B5BBA;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }

        .btn-view-enhanced:hover {
          background: #2B5BBA;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(43, 91, 186, 0.3);
        }

        .btn-delete-enhanced {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          background: linear-gradient(135deg, #dc3545 0%, #e85d68 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .btn-delete-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
          background: linear-gradient(135deg, #c82333 0%, #d64554 100%);
        }

        .btn-back-enhanced {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid #2B5BBA;
          background: white;
          color: #2B5BBA;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-back-enhanced:hover {
          background: #2B5BBA;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(43, 91, 186, 0.3);
        }

        .loading-container {
          animation: fadeInUp 0.3s ease-out;
        }

        .spinner-enhanced {
          width: 3.5rem;
          height: 3.5rem;
          border-width: 4px;
          border-color: #2B5BBA;
          border-right-color: transparent;
        }

        .empty-state-enhanced {
          text-align: center;
          padding: 80px 20px;
          animation: fadeInUp 0.5s ease-out;
        }

        .empty-state-icon {
          font-size: 5rem;
          color: #E0E0E0;
          margin-bottom: 24px;
        }

        .empty-state-text {
          color: #666;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .properties-count-badge {
          display: inline-block;
          background: linear-gradient(135deg, #2B5BBA 0%, #4A7FDB 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          margin-left: 12px;
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }

        @media (max-width: 768px) {
          .property-info-row {
            flex-direction: column;
          }

          .property-actions {
            flex-direction: column;
          }

          .btn-view-enhanced,
          .btn-delete-enhanced {
            width: 100%;
          }
        }
      `}</style>

      <AdminLayout
        title={
          <span>
            All Properties
            {!loading && properties.length > 0 && (
              <span className="properties-count-badge">{properties.length}</span>
            )}
          </span>
        }
        controls={(
          <NavLink to="/admin" className="btn-back-enhanced">
            ← Back to Requests
          </NavLink>
        )}
      >
        {loading ? (
          <div className="text-center py-5 loading-container">
            <div className="spinner-border spinner-enhanced" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-4" style={{ color: '#666', fontWeight: 600, fontSize: '1.1rem' }}>
              Loading properties...
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state-enhanced">
            <div className="empty-state-icon">🏘️</div>
            <div className="empty-state-text">No properties found.</div>
            <p style={{ color: '#999', marginTop: '12px' }}>Properties will appear here once they are approved.</p>
          </div>
        ) : (
          <div className="row g-4">
            {properties.map((prop, index) => (
              <div className="col-12 col-lg-6" key={prop._id} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="properties-enhanced-card">
                  <div className="property-card-header">
                    <h5 className="property-title-enhanced">{prop.title}</h5>
                    
                    <div className="property-info-row">
                      <div className="property-info-badge">
                         <span style={{ fontSize: '16px' }}>रु</span>  {/* Nepali Rupee symbol */}
                         <span>{prop.price?.toLocaleString() || "N/A"}</span>  {/* Price displayed */}
                      </div>
                      <div className="property-info-badge">
                        <FiHome size={16} />
                        <span>{prop.propertyType}</span>
                      </div>
                      <div className="property-info-badge">
                        <span style={{ fontSize: '14px' }}>🏷️</span>
                        <span>{prop.listingType === "sale" ? "For Sale" : "For Rent"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="property-card-body">
                    <div className="property-location-banner">
                      <FiMapPin />
                      <div className="property-location-text">
                        {prop.location?.address}, {prop.location?.city}
                      </div>
                    </div>

                    {prop.postedBy && (
                      <div className="posted-by-section">
                        <FiUser />
                        <div className="posted-by-text">
                          <div className="posted-by-name">
                            {prop.postedBy.firstName} {prop.postedBy.lastName}
                          </div>
                          <div>{prop.postedBy.email}</div>
                        </div>
                      </div>
                    )}

                    {prop.reports && prop.reports.length > 0 && (
                      <div className="reports-section">
                        <div className="reports-header">
                          <FiAlertTriangle size={18} />
                          <span>Reports ({prop.reports.length})</span>
                        </div>
                        {prop.reports.map((r) => (
                          <div key={r._id} className="report-item">
                            <div>
                              <span className="report-reason-badge">{r.reason}</span>
                            </div>
                            <div className="report-user-info">
                              {r.user ? `${r.user.firstName} ${r.user.lastName} (${r.user.email})` : "Unknown user"}
                            </div>
                            <div className="report-date">
                              {new Date(r.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="property-actions">
                      <NavLink to={`/property/${prop._id}`} className="btn-view-enhanced">
                        <FiEye size={18} />
                        View Property
                      </NavLink>
                      <button className="btn-delete-enhanced" onClick={() => handleDelete(prop._id)}>
                        <FiTrash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default AdminProperties;

  