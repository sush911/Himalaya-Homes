import React, { useEffect, useState } from "react";
import { getContactMessages, updateContactStatus, deleteContactMessage } from "../api/contact";
import { Button, Badge } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout";

const AdminContactMessages = () => {
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

  return (
    <AdminLayout title={"Contact Messages"}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div />
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${statusFilter === "" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setStatusFilter("")}
          >
            All
          </button>
          <button
            type="button"
            className={`btn ${statusFilter === "new" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setStatusFilter("new")}
          >
            New
          </button>
          <button
            type="button"
            className={`btn ${statusFilter === "read" ? "btn-info" : "btn-outline-info"}`}
            onClick={() => setStatusFilter("read")}
          >
            Read
          </button>
          <button
            type="button"
            className={`btn ${statusFilter === "replied" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setStatusFilter("replied")}
          >
            Replied
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="alert alert-info">No contact messages found.</div>
      ) : (
        <div className="row g-3">
          {messages.map((msg) => (
            <div className="col-md-6" key={msg._id}>
              <div className="card h-100 admin-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <Badge bg={getStatusBadge(msg.status)}>{msg.status}</Badge>
                  <small className="text-muted">{formatDate(msg.createdAt)}</small>
                </div>
                <div className="card-body">
                  <h6 className="card-title">{msg.name}</h6>
                  <p className="mb-1">
                    <strong>Email:</strong> {msg.email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {msg.phone}
                  </p>
                  <p className="mb-3">
                    <strong>Message:</strong> {msg.message}
                  </p>
                  {msg.submittedBy && (
                    <p className="small text-muted mb-3">
                      Submitted by: {msg.submittedBy.firstName} {msg.submittedBy.lastName} ({msg.submittedBy.email})
                    </p>
                  )}
                  <div className="d-flex gap-2 flex-wrap">
                    {msg.status !== "new" && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleStatusUpdate(msg._id, "new")}
                      >
                        Mark as New
                      </Button>
                    )}
                    {msg.status !== "read" && (
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleStatusUpdate(msg._id, "read")}
                      >
                        Mark as Read
                      </Button>
                    )}
                    {msg.status !== "replied" && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleStatusUpdate(msg._id, "replied")}
                      >
                        Mark as Replied
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(msg._id)}
                    >
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

export default AdminContactMessages;

