// src/pages/Signup.jsx
import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import hvImg from "../assets/hv.jpg";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", citizenshipNumber: "", email: "", password: ""
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => setPreviewPic(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("phone", form.phone);
      formData.append("citizenshipNumber", form.citizenshipNumber);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await registerUser(formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body, html {
          overflow-x: hidden;
        }
        
        .auth-full {
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
          position: relative;
        }
        
        .auth-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
        }
        
        .auth-left {
          flex: 0 0 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 3rem;
          background: #f8fafc;
          overflow-y: auto;
        }
        
        .card-auth {
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          padding: 50px 60px;
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12), 0 8px 24px rgba(15, 23, 42, 0.08);
          margin: 2rem 0;
        }
        
        .auth-heading {
          font-size: 44px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }
        
        .auth-sub {
          font-size: 17px;
          color: #64748b;
          margin-bottom: 40px;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .avatar-section {
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .avatar-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          background-color: #e2e8f0;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
          flex-shrink: 0;
        }
        
        .avatar-info {
          flex: 1;
        }
        
        .avatar-label {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          display: block;
          letter-spacing: -0.01em;
        }
        
        .file-input-wrapper {
          position: relative;
        }
        
        .file-input-custom {
          display: none;
        }
        
        .file-input-label {
          display: inline-block;
          padding: 10px 20px;
          background: #f1f5f9;
          color: #475569;
          font-size: 14px;
          font-weight: 500;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid #e2e8f0;
        }
        
        .file-input-label:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-label {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
          display: block;
          letter-spacing: -0.01em;
        }
        
        .form-control {
          width: 100%;
          height: 52px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 18px;
          font-size: 15px;
          color: #0f172a;
          transition: all 0.25s ease;
          background: #ffffff;
        }
        
        .form-control::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
        
        .form-control:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.1);
          outline: none;
          background: #ffffff;
        }
        
        .password-wrapper {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: color 0.2s ease;
        }
        
        .password-toggle:hover {
          color: #3b82f6;
        }
        
        .password-toggle svg {
          width: 20px;
          height: 20px;
        }
        
        .btn-submit {
          width: 100%;
          height: 56px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: -0.01em;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
          margin-top: 32px;
        }
        
        .btn-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.45);
        }
        
        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .login-link-container {
          text-align: center;
          margin-top: 24px;
        }
        
        .login-text {
          font-size: 15px;
          color: #64748b;
          font-weight: 400;
        }
        
        .link-primary {
          font-size: 15px;
          font-weight: 500;
          color: #3b82f6;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-left: 6px;
        }
        
        .link-primary:hover {
          color: #2563eb;
          text-decoration: none;
        }
        
        .auth-right {
          flex: 0 0 50%;
          position: relative;
          overflow: hidden;
        }
        
        .auth-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
        }
        
        .auth-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .auth-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.35) 0%, rgba(30, 41, 59, 0.25) 100%);
        }
        
        @media (max-width: 992px) {
          .auth-left {
            flex: 0 0 100%;
            padding: 3rem 2rem;
          }
          
          .auth-right {
            display: none;
          }
          
          .card-auth {
            padding: 40px 36px;
            max-width: 500px;
          }
          
          .auth-heading {
            font-size: 36px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
        
        @media (max-width: 576px) {
          .card-auth {
            padding: 36px 28px;
          }
          
          .auth-heading {
            font-size: 32px;
          }
          
          .auth-sub {
            font-size: 15px;
          }
          
          .avatar-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
      
      <div className="auth-full">
        <div className="auth-container">
          {/* Left Side - Signup Card */}
          <div className="auth-left">
            <div className="card-auth">
              <h3 className="auth-heading">Create an account</h3>
              <div className="auth-sub">Set up your account to list properties, save favorites and contact owners.</div>

              <form onSubmit={handleSubmit}>
                {/* Profile Picture Upload */}
                <div className="avatar-section">
                  <div 
                    className="avatar-preview" 
                    style={{ 
                      backgroundImage: `url(${previewPic || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"})` 
                    }}
                  />
                  <div className="avatar-info">
                    <label className="avatar-label">Profile Photo</label>
                    <div className="file-input-wrapper">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="file-input-custom" 
                        id="profilePicInput"
                        onChange={handleFile} 
                      />
                      <label htmlFor="profilePicInput" className="file-input-label">
                        Choose Photo
                      </label>
                    </div>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">First name</label>
                    <input 
                      name="firstName" 
                      value={form.firstName} 
                      onChange={handleChange} 
                      required 
                      className="form-control"
                      placeholder="Ram" 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Last name</label>
                    <input 
                      name="lastName" 
                      value={form.lastName} 
                      onChange={handleChange} 
                      required 
                      className="form-control"
                      placeholder="Krishna" 
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                    placeholder="+977 " 
                  />
                </div>

                {/* Citizenship Number */}
                <div className="form-group">
                  <label className="form-label">Citizenship Number</label>
                  <input 
                    name="citizenshipNumber" 
                    value={form.citizenshipNumber} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                    placeholder="00-00-000000" 
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                    type="email" 
                    className="form-control"
                    placeholder="you@example.com" 
                  />
                </div>

                {/* Password with Toggle */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input 
                      name="password" 
                      value={form.password} 
                      onChange={handleChange} 
                      required 
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  disabled={loading} 
                  className="btn-submit" 
                  type="submit"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>

                {/* Login Link */}
                <div className="login-link-container">
                  <span className="login-text">Already have an account?</span>
                  <Link to="/login" className="link-primary">Login</Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Image (touches edge perfectly) */}
          <div className="auth-right">
            <div className="auth-image-wrapper">
              <img src={hvImg} alt="Property" className="auth-image" />
              <div className="auth-image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}