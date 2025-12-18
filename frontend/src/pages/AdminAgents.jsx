import React, { useEffect, useState } from "react";
import { getAgents, createAgent, updateAgent, deleteAgent } from "../api/agent";
import { uploadFiles } from "../api/property";
import AdminLayout from "../components/AdminLayout";
import { useLanguage } from "../context/LanguageContext";

const AdminAgents = () => {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", photo: "" });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!token) return;
    loadAgents();
  }, [token]);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const res = await getAgents(token);
      setAgents(res.data || []);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      let photoUrl = form.photo;
      if (file) {
        const uploadRes = await uploadFiles([file], "agents", token);
        photoUrl = uploadRes.data.urls?.[0] || photoUrl;
      }

      if (editing) {
        await updateAgent(editing._id, { ...form, photo: photoUrl }, token);
        alert("Agent updated");
      } else {
        await createAgent({ ...form, photo: photoUrl }, token);
        alert("Agent created");
      }
      setForm({ name: "", email: "", phone: "", address: "", photo: "" });
      setFile(null);
      setPreviewUrl(null);
      setEditing(null);
      loadAgents();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save agent");
    }
  };

  const handleEdit = (a) => {
    setEditing(a);
    setForm({ name: a.name, email: a.email, phone: a.phone, address: a.address || "", photo: a.photo || "" });
    setPreviewUrl(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this agent?")) return;
    try {
      await deleteAgent(id, token);
      alert("Agent deleted");
      loadAgents();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", address: "", photo: "" });
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .admin-agents-container {
          padding: 0;
        }
        
        .agents-header {
          margin-bottom: 32px;
        }
        
        .agents-title {
          font-size: 28px;
          font-weight: 800;
          color: #1E3A5F;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .agents-subtitle {
          font-size: 15px;
          color: #666;
        }
        
        .form-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 32px;
          border: none;
        }
        
        .form-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1E3A5F;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .form-card-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .form-group-custom {
          margin-bottom: 20px;
        }
        
        .form-label-custom {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          display: block;
        }
        
        .form-input-custom {
          width: 100%;
          height: 48px;
          border: 2px solid #E0E0E0;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 15px;
          color: #333;
          transition: all 0.2s ease;
        }
        
        .form-input-custom:focus {
          outline: none;
          border-color: #2B5BBA;
          box-shadow: 0 0 0 4px rgba(43, 91, 186, 0.1);
        }
        
        .file-upload-wrapper {
          position: relative;
        }
        
        .file-upload-custom {
          display: none;
        }
        
        .file-upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 48px;
          border: 2px dashed #d0d0d0;
          border-radius: 10px;
          background: #fafafa;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }
        
        .file-upload-label:hover {
          border-color: #2B5BBA;
          background: #f0f5ff;
        }
        
        .file-upload-icon {
          width: 20px;
          height: 20px;
        }
        
        .preview-image {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          margin-top: 12px;
          border: 2px solid #E0E0E0;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          padding-top: 24px;
          border-top: 2px solid #f0f0f0;
        }
        
        .btn-submit {
          height: 48px;
          padding: 0 32px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }
        
        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(43, 91, 186, 0.4);
        }
        
        .btn-cancel {
          height: 48px;
          padding: 0 24px;
          background: #fff;
          border: 2px solid #E0E0E0;
          border-radius: 10px;
          color: #666;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-cancel:hover {
          background: #f5f5f5;
          border-color: #ccc;
        }
        
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }
        
        .agent-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          border: none;
          transition: all 0.3s ease;
        }
        
        .agent-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        
        .agent-card-content {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .agent-avatar {
          width: 96px;
          height: 96px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
          border: 3px solid #f0f0f0;
        }
        
        .agent-info {
          flex: 1;
        }
        
        .agent-name {
          font-size: 18px;
          font-weight: 700;
          color: #1E3A5F;
          margin-bottom: 8px;
        }
        
        .agent-detail {
          font-size: 14px;
          color: #666;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .agent-detail-icon {
          width: 16px;
          height: 16px;
          color: #2B5BBA;
        }
        
        .agent-actions {
          display: flex;
          gap: 10px;
          padding-top: 20px;
          border-top: 2px solid #f5f5f5;
        }
        
        .btn-edit {
          flex: 1;
          height: 40px;
          background: #fff;
          border: 2px solid #2B5BBA;
          border-radius: 8px;
          color: #2B5BBA;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-edit:hover {
          background: #2B5BBA;
          color: #fff;
        }
        
        .btn-delete {
          flex: 1;
          height: 40px;
          background: #fff;
          border: 2px solid #dc3545;
          border-radius: 8px;
          color: #dc3545;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-delete:hover {
          background: #dc3545;
          color: #fff;
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
          padding: 60px 20px;
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
        
        @media (max-width: 768px) {
          .form-card {
            padding: 24px;
          }
          
          .agents-grid {
            grid-template-columns: 1fr;
          }
          
          .agent-card-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .agent-avatar {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
      
      <AdminLayout title={"Manage Agents"}>
        <div className="admin-agents-container">
          <div className="agents-header">
            <h2 className="agents-title">Agent Management</h2>
            <p className="agents-subtitle">Create and manage your real estate agents</p>
          </div>

          {/* Form Card */}
          <div className="form-card">
            <h5 className="form-card-title">
              <div className="form-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {editing ? "Edit Agent" : "Add New Agent"}
            </h5>
            
            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group-custom">
                    <label className="form-label-custom">Full Name</label>
                    <input 
                      name="name" 
                      className="form-input-custom" 
                      value={form.name} 
                      onChange={handleChange} 
                      required 
                      placeholder="Ram krishna"
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group-custom">
                    <label className="form-label-custom">Email Address</label>
                    <input 
                      name="email" 
                      type="email" 
                      className="form-input-custom" 
                      value={form.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="ramkrishna@example.com"
                    />
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="form-group-custom">
                    <label className="form-label-custom">Phone Number</label>
                    <input 
                      name="phone" 
                      className="form-input-custom" 
                      value={form.phone} 
                      onChange={handleChange} 
                      required 
                      placeholder="+977 9812345678"
                    />
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="form-group-custom">
                    <label className="form-label-custom">Address</label>
                    <input 
                      name="address" 
                      className="form-input-custom" 
                      value={form.address} 
                      onChange={handleChange} 
                      placeholder="Kathmandu, Nepal"
                    />
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="form-group-custom">
                    <label className="form-label-custom">Profile Photo</label>
                    <div className="file-upload-wrapper">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="file-upload-custom" 
                        id="agentPhoto"
                        onChange={handleFile} 
                      />
                      <label htmlFor="agentPhoto" className="file-upload-label">
                        <svg className="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {file ? file.name : "Choose Photo"}
                      </label>
                      {previewUrl && (
                        <img src={previewUrl} alt="Preview" className="preview-image" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-submit" type="submit">
                  {editing ? "Update Agent" : "Create Agent"}
                </button>
                {editing && (
                  <button type="button" className="btn-cancel" onClick={cancelEdit}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Agents Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h5 className="empty-state-title">No agents found</h5>
              <p className="empty-state-text">Start by adding your first agent using the form above</p>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map((a) => (
                <div className="agent-card" key={a._id}>
                  <div className="agent-card-content">
                    <img 
                      src={a.photo || "/src/assets/profile.png"} 
                      alt={a.name} 
                      className="agent-avatar"
                    />
                    <div className="agent-info">
                      <h5 className="agent-name">{a.name}</h5>
                      <div className="agent-detail">
                        <svg className="agent-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {a.email}
                      </div>
                      <div className="agent-detail">
                        <svg className="agent-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {a.phone}
                      </div>
                      {a.address && (
                        <div className="agent-detail">
                          <svg className="agent-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {a.address}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="agent-actions">
                    <button className="btn-edit" onClick={() => handleEdit(a)}>
                      Edit Agent
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(a._id)}>
                      Delete
                    </button>
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

export default AdminAgents;