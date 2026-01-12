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
        if (res?.data?.profilePic) {
          setUser({ ...user, profilePic: res.data.profilePic });
          // Force navbar to refresh by triggering a storage event
          window.dispatchEvent(new Event('profileUpdated'));
        }
      } else {
        await updateProfile(edit, token);
      }
      alert(t('profileUpdated'));
      // Reload user data to get fresh profile pic
      const freshUser = await getMe(token);
      setUser(freshUser.data);
      setEdit({ email: freshUser.data.email || "", phone: freshUser.data.phone || "" });
      setFile(null);
      setPreview("");
    } catch (err) {
      alert(err?.response?.data?.message || t('updateFailed'));
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #f5f7fa;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 20px;
          background: #f5f7fa;
        }
        
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #e2e8f0;
          border-top-color: #2B5BBA;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading-text {
          font-size: 16px;
          color: #64748b;
          font-weight: 500;
        }
        
        .profile-wrapper {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 2rem 1rem;
        }
        
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .profile-card {
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        .profile-header-section {
          background: #2B5BBA;
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .profile-header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffffff;
        }
        
        .profile-info {
          color: #ffffff;
        }
        
        .profile-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        
        .profile-email {
          font-size: 14px;
          opacity: 0.95;
          margin: 0;
        }
        
        .btn-edit {
          background: #ffffff;
          color: #2B5BBA;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-edit:hover {
          background: #f0f4ff;
        }
        
        .profile-body {
          padding: 40px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .form-row.single {
          grid-template-columns: 1fr;
        }
        
        .form-group {
          position: relative;
        }
        
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
          display: block;
        }
        
        .form-control {
          width: 100%;
          height: 48px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 0 16px;
          font-size: 15px;
          color: #1e293b;
          transition: border-color 0.2s;
          background: #ffffff;
        }
        
        .form-control:focus {
          border-color: #2B5BBA;
          outline: none;
        }
        
        .form-control:disabled {
          background: #f8fafc;
          color: #94a3b8;
          cursor: not-allowed;
          border-color: #e2e8f0;
        }
        
        .lock-icon {
          position: absolute;
          right: 16px;
          top: 38px;
          color: #cbd5e0;
        }
        
        .lock-icon svg {
          width: 18px;
          height: 18px;
        }
        
        .upload-section {
          margin-bottom: 24px;
          padding: 24px;
          border: 2px dashed #d1d5db;
          border-radius: 6px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
          position: relative;
          background: #fafbfc;
        }
        
        .upload-section:hover {
          border-color: #2B5BBA;
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
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          background: #2B5BBA;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        
        .upload-icon svg {
          width: 24px;
          height: 24px;
        }
        
        .upload-text {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
        }
        
        .upload-subtext {
          font-size: 13px;
          color: #94a3b8;
        }
        
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }
        
        .btn-primary {
          flex: 1;
          height: 48px;
          background: #2B5BBA;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #1E3A5F;
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          height: 48px;
          padding: 0 24px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-secondary:hover {
          border-color: #9ca3af;
          background: #f9fafb;
        }
        
        @media (max-width: 768px) {
          .profile-header-section {
            flex-direction: column;
            gap: 20px;
            padding: 24px;
          }
          
          .profile-header-left {
            flex-direction: column;
            text-align: center;
          }
          
          .profile-body {
            padding: 24px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
      
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="profile-card">
            {/* Header Section */}
            <div className="profile-header-section">
              <div className="profile-header-left">
                <img 
                  src={preview || resolveImage(user.profilePic) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e0"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E'} 
                  alt="Profile" 
                  className="profile-avatar" 
                />
                <div className="profile-info">
                  <h1 className="profile-title">{t('myProfile')}</h1>
                  <p className="profile-email">{user.email}</p>
                </div>
              </div>
              <button className="btn-edit" onClick={() => document.getElementById('profilePicInput').click()}>
                {t('edit')}
              </button>
            </div>

            {/* Body Section */}
            <div className="profile-body">
              {/* Upload Section (Hidden) */}
              <input 
                id="profilePicInput"
                type="file" 
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                }} 
              />

              {/* Upload Preview Section */}
              {(file || preview) && (
                <div className="upload-section">
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="upload-text">{t('changeProfilePicture')}</div>
                  <div className="upload-subtext">{file ? file.name : t('clickToUpload')}</div>
                </div>
              )}

              {/* First Name | Last Name */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('firstName')}</label>
                  <input 
                    className="form-control" 
                    value={user.firstName || ""} 
                    disabled 
                  />
                  <div className="lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('lastName')}</label>
                  <input 
                    className="form-control" 
                    value={user.lastName || ""} 
                    disabled 
                  />
                  <div className="lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email | Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('emailAddress')}</label>
                  <input 
                    name="email" 
                    className="form-control" 
                    value={edit.email} 
                    onChange={handleChange}
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('phoneNumber')}</label>
                  <input 
                    name="phone" 
                    className="form-control" 
                    value={edit.phone} 
                    onChange={handleChange}
                    placeholder="+977 9812345678"
                  />
                </div>
              </div>

              {/* Citizenship (Locked) */}
              <div className="form-row single">
                <div className="form-group">
                  <label className="form-label">{t('citizenshipNumber')}</label>
                  <input 
                    className="form-control" 
                    value={user.citizenshipNumber || ""} 
                    disabled 
                  />
                  <div className="lock-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn-primary" 
                  onClick={handleSave} 
                  disabled={loading}
                >
                  {loading ? t('savingChanges') : t('saveChanges')}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setEdit({ email: user.email || "", phone: user.phone || "" });
                    setFile(null);
                    setPreview("");
                  }}
                >
                  {t('reset')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
