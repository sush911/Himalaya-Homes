// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { requestPasswordReset, resetPassword } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import oImg from "../assets/o.jpg";
import { useLanguage } from "../context/LanguageContext";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: code & new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      alert("Reset code sent to your email!");
      setStep(2);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword });
      alert("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
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
          padding: 5rem 4rem;
          background: #f8fafc;
        }
        
        .card-auth {
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          padding: 60px 70px;
          border-radius: 32px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12), 0 8px 24px rgba(15, 23, 42, 0.08);
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
          margin-bottom: 48px;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .step-indicator {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
        }
        
        .step-dot {
          flex: 1;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        .step-dot.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        
        .form-group {
          margin-bottom: 28px;
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
          height: 58px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px 20px;
          font-size: 16px;
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
          height: 58px;
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
          margin-top: 36px;
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
        
        .back-link-container {
          text-align: center;
          margin-top: 28px;
        }
        
        .link-primary {
          font-size: 15px;
          font-weight: 500;
          color: #3b82f6;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .link-primary:hover {
          color: #2563eb;
          text-decoration: none;
        }
        
        .link-primary svg {
          width: 16px;
          height: 16px;
        }
        
        .info-box {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 16px 20px;
          margin-top: 24px;
          display: flex;
          gap: 12px;
        }
        
        .info-box svg {
          width: 20px;
          height: 20px;
          color: #3b82f6;
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .info-box-text {
          font-size: 14px;
          color: #1e40af;
          line-height: 1.5;
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
        
        .code-input {
          text-align: center;
          letter-spacing: 8px;
          font-size: 24px;
          font-weight: 700;
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
            padding: 48px 40px;
            max-width: 500px;
          }
          
          .auth-heading {
            font-size: 36px;
          }
        }
        
        @media (max-width: 576px) {
          .card-auth {
            padding: 40px 32px;
          }
          
          .auth-heading {
            font-size: 32px;
          }
          
          .auth-sub {
            font-size: 15px;
          }
        }
      `}</style>
      
      <div className="auth-full">
        <div className="auth-container">
          {/* Left Side - Forgot Password Card */}
          <div className="auth-left">
            <div className="card-auth">
              <h3 className="auth-heading">
                {step === 1 ? "Forgot Password?" : "Reset Password"}
              </h3>
              <div className="auth-sub">
                {step === 1
                  ? "Enter your email address and we'll send you a reset code"
                  : "Enter the code sent to your email and your new password"}
              </div>

              {/* Step Indicator */}
              <div className="step-indicator">
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
              </div>

              {step === 1 ? (
                <form onSubmit={handleRequestCode}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-control"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button className="btn-submit" type="submit" disabled={loading}>
                    {loading ? "Sending Code..." : "Send Reset Code"}
                  </button>

                  <div className="info-box">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="info-box-text">
                      We'll send a 6-digit code to your email. The code will expire in 15 minutes.
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label className="form-label">Reset Code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      className="form-control code-input"
                      placeholder="000000"
                      maxLength="6"
                      autoComplete="off"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="form-control"
                        placeholder="Enter new password"
                        autoComplete="new-password"
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

                  <button className="btn-submit" type="submit" disabled={loading}>
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </button>

                  <div className="info-box">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className="info-box-text">
                      Make sure your password is at least 8 characters long and includes a mix of letters and numbers.
                    </div>
                  </div>
                </form>
              )}

              <div className="back-link-container">
                <Link to="/login" className="link-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Image (touches edge perfectly) */}
          <div className="auth-right">
            <div className="auth-image-wrapper">
              <img src={oImg} alt="Property" className="auth-image" />
              <div className="auth-image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
