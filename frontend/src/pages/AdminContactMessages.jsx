import React, { useEffect, useState } from "react";
import { getContactMessages, updateContactStatus, deleteContactMessage } from "../api/contact";
import { Button, Badge } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout";
import { useLanguage } from "../context/LanguageContext";

const AdminContactMessages = () => {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!token) return;
    loadMessages();
  }, [statusFilter, token]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await getContactMessages(statusFilter, token);
      setMessages(res.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus, token);
      loadMessages();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      await deleteContactMessage(id, token);
      loadMessages();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete message");
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

  const getStatusBadge = (status) => {
    const badges = {
      new: "primary",
      read: "info",
      replied: "success",
    };
    return badges[status] || "secondary";
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#2B5BBA",
      read: "#17a2b8",
      replied: "#28a745",
    };
    return colors[status] || "#6c757d";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .contact-messages-container {
          padding: 0;
        }
        
        .messages-header {
          margin-bottom: 32px;
        }
        
        .messages-title {
          font-size: 28px;
          font-weight: 800;
          color: #1E3A5F;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .messages-subtitle {
          font-size: 15px;
          color: #666;
        }
        
        .filter-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .stats-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #fff;
          border: 2px solid #E0E0E0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        
        .stat-count {
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          color: #fff;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 13px;
        }
        
        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          height: 40px;
          padding: 0 20px;
          border: 2px solid #E0E0E0;
          border-radius: 10px;
          background: #fff;
          color: #333;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-btn:hover {
          border-color: #2B5BBA;
          color: #2B5BBA;
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-color: #2B5BBA;
          color: #fff;
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }
        
        .filter-btn-new.active {
          background: #2B5BBA;
          border-color: #2B5BBA;
        }
        
        .filter-btn-read.active {
          background: #17a2b8;
          border-color: #17a2b8;
        }
        
        .filter-btn-replied.active {
          background: #28a745;
          border-color: #28a745;
        }
        
        .loading-container {
          text-align: center;
          padding: 80px 20px;
        }
        
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f0f0f0;
          border-top-color: #2B5BBA;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading-text {
          font-size: 16px;
          color: #666;
          font-weight: 500;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 40px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }
        
        .empty-state-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .empty-state-title {
          font-size: 20px;
          font-weight: 700;
          color: #1E3A5F;
          margin-bottom: 8px;
        }
        
        .empty-state-text {
          font-size: 15px;
          color: #666;
        }
        
        .messages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 24px;
        }
        
        .message-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: none;
        }
        
        .message-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        
        .message-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 2px solid #E0E0E0;
        }
        
        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-badge-new {
          background: #2B5BBA;
          color: #fff;
        }
        
        .status-badge-read {
          background: #17a2b8;
          color: #fff;
        }
        
        .status-badge-replied {
          background: #28a745;
          color: #fff;
        }
        
        .message-date {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }
        
        .message-card-body {
          padding: 24px;
        }
        
        .message-sender {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .sender-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
        
        .sender-info {
          flex: 1;
        }
        
        .sender-name {
          font-size: 18px;
          font-weight: 700;
          color: #1E3A5F;
          margin-bottom: 2px;
        }
        
        .sender-email {
          font-size: 13px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .contact-detail {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #333;
        }
        
        .contact-detail-icon {
          width: 16px;
          height: 16px;
          color: #2B5BBA;
        }
        
        .message-content {
          background: #f8f9fa;
          border-left: 4px solid #2B5BBA;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .message-label {
          font-size: 12px;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .message-text {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          margin: 0;
        }
        
        .submitter-info {
          padding: 12px;
          background: #fff9e6;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 13px;
          color: #856404;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .submitter-icon {
          width: 16px;
          height: 16px;
          color: #856404;
        }
        
        .message-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 16px;
          border-top: 2px solid #f0f0f0;
        }
        
        .action-btn {
          flex: 1;
          min-width: 100px;
          height: 36px;
          border: 2px solid;
          border-radius: 8px;
          background: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .action-btn-new {
          border-color: #2B5BBA;
          color: #2B5BBA;
        }
        
        .action-btn-new:hover {
          background: #2B5BBA;
          color: #fff;
        }
        
        .action-btn-read {
          border-color: #17a2b8;
          color: #17a2b8;
        }
        
        .action-btn-read:hover {
          background: #17a2b8;
          color: #fff;
        }
        
        .action-btn-replied {
          border-color: #28a745;
          color: #28a745;
        }
        
        .action-btn-replied:hover {
          background: #28a745;
          color: #fff;
        }
        
        .action-btn-delete {
          border-color: #dc3545;
          color: #dc3545;
        }
        
        .action-btn-delete:hover {
          background: #dc3545;
          color: #fff;
        }
        
        @media (max-width: 768px) {
          .messages-grid {
            grid-template-columns: 1fr;
          }
          
          .filter-section {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .message-actions {
            flex-direction: column;
          }
          
          .action-btn {
            width: 100%;
          }
        }
      `}</style>
      
      <AdminLayout title={"Contact Messages"}>
        <div className="contact-messages-container">
          <div className="messages-header">
            <h2 className="messages-title">Contact Messages</h2>
            <p className="messages-subtitle">Manage and respond to customer inquiries</p>
          </div>

          <div className="filter-section">
            <div className="stats-container">
              <div className="stat-badge">
                <span>Total Messages</span>
                <span className="stat-count">{messages.length}</span>
              </div>
            </div>
            
            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === "" ? "active" : ""}`}
                onClick={() => setStatusFilter("")}
              >
                All
              </button>
              <button
                className={`filter-btn filter-btn-new ${statusFilter === "new" ? "active" : ""}`}
                onClick={() => setStatusFilter("new")}
              >
                New
              </button>
              <button
                className={`filter-btn filter-btn-read ${statusFilter === "read" ? "active" : ""}`}
                onClick={() => setStatusFilter("read")}
              >
                Read
              </button>
              <button
                className={`filter-btn filter-btn-replied ${statusFilter === "replied" ? "active" : ""}`}
                onClick={() => setStatusFilter("replied")}
              >
                Replied
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h5 className="empty-state-title">No Messages Found</h5>
              <p className="empty-state-text">
                {statusFilter ? `No ${statusFilter} messages at the moment` : "No contact messages yet"}
              </p>
            </div>
          ) : (
            <div className="messages-grid">
              {messages.map((msg) => (
                <div className="message-card" key={msg._id}>
                  <div className="message-card-header">
                    <span className={`status-badge status-badge-${msg.status}`}>
                      {msg.status}
                    </span>
                    <span className="message-date">{formatDate(msg.createdAt)}</span>
                  </div>
                  
                  <div className="message-card-body">
                    <div className="message-sender">
                      <div className="sender-avatar">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="sender-info">
                        <div className="sender-name">{msg.name}</div>
                        <div className="sender-email">
                          <svg className="contact-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {msg.email}
                        </div>
                      </div>
                    </div>

                    <div className="contact-detail">
                      <svg className="contact-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {msg.phone}
                    </div>

                    <div className="message-content">
                      <div className="message-label">Message</div>
                      <p className="message-text">{msg.message}</p>
                    </div>

                    {msg.submittedBy && (
                      <div className="submitter-info">
                        <svg className="submitter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>
                          Submitted by: {msg.submittedBy.firstName} {msg.submittedBy.lastName} ({msg.submittedBy.email})
                        </span>
                      </div>
                    )}

                    <div className="message-actions">
                      <button
                        className="action-btn action-btn-read"
                        onClick={() => handleStatusUpdate(msg._id, msg.status === "read" ? "new" : "read")}
                      >
                        {msg.status === "read" ? "Mark Unseen" : "Mark Seen"}
                      </button>
                      <button
                        className="action-btn action-btn-delete"
                        onClick={() => handleDelete(msg._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminContactMessages;


