// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { getMe, updateProfile } from "../api/auth";
import { useLanguage } from "../context/LanguageContext";

export default function Profile() {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const API_HOST = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:5000";

  const resolveImage = (src) => {
    if (!src) return '';
    if (src.startsWith('data:') || src.startsWith('http')) return src;
    if (src.startsWith('/uploads') || src.startsWith('uploads')) return `${API_HOST}${src.startsWith('/') ? src : '/' + src}`;
    return src;
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await getMe(token);
        setUser(res.data);
        setEdit({ email: res.data.email || "", phone: res.data.phone || "" });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  const handleChange = (e) => setEdit({ ...edit, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append("profilePic", file);
        fd.append("email", edit.email);
        fd.append("phone", edit.phone);
        const res = await updateProfile(fd, token);
        if (res?.data?.profilePic) setUser({ ...user, profilePic: res.data.profilePic });
      } else {
        await updateProfile(edit, token);
      }
      alert("Profile updated");
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  if (!user) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">{t('loadingProfile')}</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #fafbfc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 24px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
        }
        
        .loading-spinner {
          width: 56px;
          height: 56px;
          border: 5px solid rgba(255, 255, 255, 0.2);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading-text {
          font-size: 18px;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        
        .profile-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .profile-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 80%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        
        .profile-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        
        .profile-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.12);
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .profile-header-section {
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          padding: 48px 56px 64px;
          position: relative;
          overflow: hidden;
        }
        
        .profile-header-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.6;
        }
        
        .profile-header-content {
          display: flex;
          align-items: center;
          gap: 40px;
          position: relative;
          z-index: 1;
        }
        
        .avatar-container {
          position: relative;
        }
        
        .profile-avatar {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .profile-avatar:hover {
          transform: scale(1.05);
        }
        
        .avatar-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          border-radius: 50%;
          border: 4px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);
        }
        
        .avatar-badge svg {
          width: 18px;
          height: 18px;
          color: #ffffff;
        }
        
        .profile-info {
          flex: 1;
        }
        
        .profile-name {
          font-size: 38px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 14px 0;
          letter-spacing: -0.03em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .profile-badges {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        
        .badge svg {
          width: 18px;
          height: 18px;
          opacity: 0.9;
        }
        
        .profile-body {
          padding: 56px;
          background: #ffffff;
        }
        
        .section-header {
          margin-bottom: 36px;
        }
        
        .section-title {
          font-size: 26px;
          font-weight: 700;
          color: #1E3A5F;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }
        
        .section-subtitle {
          font-size: 16px;
          color: #718096;
          font-weight: 400;
          margin: 0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-bottom: 32px;
        }
        
        .form-group {
          position: relative;
        }
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          font-size: 12px;
          color: #718096;
        }
        
        .form-label svg {
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }
        
        .form-control {
          width: 100%;
          height: 56px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 20px;
          font-size: 16px;
          color: #1a202c;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: #ffffff;
          font-weight: 500;
        }
        
        .form-control::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }
        
        .form-control:focus {
          border-color: #2B5BBA;
          box-shadow: 0 0 0 4px rgba(43, 91, 186, 0.12);
          outline: none;
          background: #ffffff;
        }
        
        .form-control:disabled {
          background: #f7fafc;
          color: #a0aec0;
          cursor: not-allowed;
          border-color: #e2e8f0;
        }
        
        .input-icon {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #cbd5e0;
          pointer-events: none;
        }
        
        .input-icon svg {
          width: 20px;
          height: 20px;
        }
        
        .upload-section {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border: 2px dashed #cbd5e0;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .upload-section:hover {
          border-color: #2B5BBA;
          background: linear-gradient(135deg, #edf2f7 0%, #e6f3ff 100%);
        }
        
        .upload-section input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          cursor: pointer;
        }
        
        .upload-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        
        .upload-icon svg {
          width: 32px;
          height: 32px;
        }
        
        .upload-text {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 6px;
        }
        
        .upload-subtext {
          font-size: 14px;
          color: #718096;
        }
        
        .locked-field {
          position: relative;
        }
        
        .locked-badge {
          position: absolute;
          top: -8px;
          right: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
          color: #c53030;
          font-size: 11px;
          font-weight: 700;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .locked-badge svg {
          width: 12px;
          height: 12px;
        }
        
        .action-buttons {
          display: flex;
          gap: 16px;
          margin-top: 48px;
        }
        
        .btn-primary {
          flex: 1;
          height: 56px;
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          border: none;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.01em;
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.35);
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        
        .btn-primary:hover:not(:disabled)::before {
          left: 100%;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(43, 91, 186, 0.45);
        }
        
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          height: 58px;
          padding: 0 32px;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 600;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          border-color: #cbd5e0;
          background: #f7fafc;
          transform: translateY(-1px);
        }
        
        @media (max-width: 1024px) {
          .profile-wrapper {
            padding: 3rem 1.5rem;
          }
          
          .profile-header-section {
            padding: 40px 48px 60px;
          }
          
          .profile-body {
            padding: 48px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .profile-avatar {
            width: 140px;
            height: 140px;
          }
          
          .profile-name {
            font-size: 36px;
          }
        }
        
        @media (max-width: 768px) {
          .profile-header-section {
            padding: 32px 24px 48px;
          }
          
          .profile-header-content {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
          
          .profile-body {
            padding: 32px 24px;
          }
          
          .profile-name {
            font-size: 32px;
          }
          
          .profile-badges {
            justify-content: center;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .section-title {
            font-size: 24px;
          }
        }
      `}</style>
      
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="profile-card">
            {/* Header Section */}
            <div className="profile-header-section">
              <div className="profile-header-content">
                <div className="avatar-container">
                  <img 
                    src={preview || resolveImage(user.profilePic) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e0"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E'} 
                    alt="Profile" 
                    className="profile-avatar" 
                  />
                  <div className="avatar-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="profile-info">
                  <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
                  <div className="profile-badges">
                    <div className="badge">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="badge">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {user.phone}
                      </div>
                    )}
                    {user.citizenshipNumber && (
                      <div className="badge">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        {user.citizenshipNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="profile-body">
              <div className="section-header">
                <h2 className="section-title">Account Settings</h2>
                <p className="section-subtitle">Update your personal information and profile picture</p>
              </div>

              <div className="form-grid">
                {/* Upload Section */}
                <label className="upload-section">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setFile(f);
                      setPreview(URL.createObjectURL(f));
                    }} 
                  />
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="upload-text">Change Profile Picture</div>
                  <div className="upload-subtext">Click to upload a new photo (JPG, PNG)</div>
                </label>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <input 
                    name="email" 
                    className="form-control" 
                    value={edit.email} 
                    onChange={handleChange}
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number
                  </label>
                  <input 
                    name="phone" 
                    className="form-control" 
                    value={edit.phone} 
                    onChange={handleChange}
                    placeholder="+977 9812345678"
                  />
                </div>

                {/* Citizenship (Locked) */}
                <div className="form-group full-width locked-field">
                  <label className="form-label">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    Citizenship Number
                  </label>
                  <span className="locked-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Locked
                  </span>
                  <input 
                    className="form-control" 
                    value={user.citizenshipNumber || ""} 
                    disabled 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn-primary" 
                  onClick={handleSave} 
                  disabled={loading}
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setEdit({ email: user.email || "", phone: user.phone || "" });
                    setFile(null);
                    setPreview("");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
