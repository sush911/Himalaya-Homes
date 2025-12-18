import React, { useState } from "react";
import { Link } from "react-router-dom";
import { submitContact } from "../api/contact";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import mountainImg from "../assets/mountain.jpg";
import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to contact us");
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.message) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await submitContact(form, token);
      setMessage("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <>
        <style>{`
          .login-required-container {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e8f0fe 100%);
          }
          
          .login-required-card {
            max-width: 500px;
            background: #FFFFFF;
            padding: 48px;
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            text-align: center;
            border: 1px solid #E0E0E0;
          }
          
          .login-required-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: #2B5BBA;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
          }
          
          .login-required-title {
            font-size: 28px;
            font-weight: 700;
            color: #1E3A5F;
            margin-bottom: 12px;
          }
          
          .login-required-text {
            font-size: 16px;
            color: #333333;
            margin-bottom: 32px;
          }
          
          .btn-login {
            height: 52px;
            padding: 0 32px;
            background: #2B5BBA;
            border: none;
            border-radius: 12px;
            color: #FFFFFF;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(43, 91, 186, 0.3);
          }
          
          .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(43, 91, 186, 0.4);
            color: #FFFFFF;
          }
        `}</style>
        
        <div className="login-required-container">
          <div className="login-required-card">
            <div className="login-required-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="40" height="40">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="login-required-title">Please Login to Contact Us</h4>
            <p className="login-required-text">You need to be logged in to send us a message.</p>
            <Link to="/login" className="btn-login">
              Go to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .contact-page {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          overflow: hidden;
        }
        
        .contact-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(${mountainImg});
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        
        .contact-background::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .contact-container {
          max-width: 1000px;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        
        .contact-card {
          background: #FFFFFF;
          backdrop-filter: blur(10px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: row;
          border: 1px solid #E0E0E0;
        }
        
        .contact-form-section {
          flex: 1;
          background: #1E3A5F;
          padding: 48px;
          color: #FFFFFF;
        }
        
        .contact-form-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
          color: #FFFFFF;
        }
        
        .alert-message {
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .alert-success {
          background: rgba(40, 167, 69, 0.2);
          border: 2px solid rgba(40, 167, 69, 0.5);
          color: #fff;
        }
        
        .alert-danger {
          background: rgba(220, 53, 69, 0.2);
          border: 2px solid rgba(220, 53, 69, 0.5);
          color: #fff;
        }
        
        .form-group-contact {
          margin-bottom: 20px;
        }
        
        .form-input-contact {
          width: 100%;
          height: 52px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          transition: all 0.2s ease;
        }
        
        .form-input-contact::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .form-input-contact:focus {
          outline: none;
          border-color: #fff;
          background: rgba(255, 255, 255, 0.15);
        }
        
        .form-textarea-contact {
          width: 100%;
          min-height: 140px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          resize: vertical;
          transition: all 0.2s ease;
        }
        
        .form-textarea-contact::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .form-textarea-contact:focus {
          outline: none;
          border-color: #fff;
          background: rgba(255, 255, 255, 0.15);
        }
        
        .btn-submit-contact {
          width: 100%;
          height: 56px;
          background: #fff;
          border: none;
          border-radius: 12px;
          color: #1E3A5F;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }
        
        .btn-submit-contact:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }
        
        .btn-submit-contact:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .contact-info-section {
          flex: 1;
          background: #fff;
          padding: 48px;
        }
        
        .contact-info-title {
          font-size: 32px;
          font-weight: 800;
          color: #1E3A5F;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
        }
        
        .contact-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: #F5F5F5;
          border-radius: 12px;
          margin-bottom: 16px;
          transition: all 0.2s ease;
          border: 1px solid #E0E0E0;
        }
        
        .contact-detail-item:hover {
          background: #FFFFFF;
          border-color: #2B5BBA;
          transform: translateX(4px);
        }
        
        .contact-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #2B5BBA;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        
        .contact-detail-text {
          flex: 1;
          padding-top: 4px;
        }
        
        .contact-detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #333333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          opacity: 0.7;
        }
        
        .contact-detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
        }
        
        @media (max-width: 992px) {
          .contact-card {
            flex-direction: column;
          }
          
          .contact-form-section,
          .contact-info-section {
            padding: 36px;
          }
          
          .contact-form-title,
          .contact-info-title {
            font-size: 28px;
          }
        }
        
        @media (max-width: 576px) {
          .contact-page {
            padding: 40px 16px;
          }
          
          .contact-form-section,
          .contact-info-section {
            padding: 28px;
          }
          
          .contact-form-title,
          .contact-info-title {
            font-size: 24px;
          }
        }
      `}</style>
      
      <div className="contact-page">
        <div className="contact-background"></div>
        
        <div className="contact-container">
          <div className="contact-card">
            {/* Left - Contact Form */}
            <div className="contact-form-section">
              <h2 className="contact-form-title">Get in touch</h2>
              
              {message && (
                <div className={`alert-message ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group-contact">
                  <input
                    type="text"
                    name="name"
                    className="form-input-contact"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group-contact">
                  <input
                    type="email"
                    name="email"
                    className="form-input-contact"
                    placeholder="Your mail"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group-contact">
                  <input
                    type="tel"
                    name="phone"
                    className="form-input-contact"
                    placeholder="Your phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group-contact">
                  <textarea
                    name="message"
                    className="form-textarea-contact"
                    placeholder="Your message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-submit-contact"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            </div>

            {/* Right - Contact Info */}
            <div className="contact-info-section">
              <h2 className="contact-info-title">Feel free to contact us</h2>
              
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div className="contact-detail-text">
                  <div className="contact-detail-label">Address</div>
                  <div className="contact-detail-value">Ward no 2 Thamel, Kathmandu</div>
                </div>
              </div>
              
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <FaPhone size={18} />
                </div>
                <div className="contact-detail-text">
                  <div className="contact-detail-label">Phone 1</div>
                  <div className="contact-detail-value">908821321</div>
                </div>
              </div>
              
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <FaPhone size={18} />
                </div>
                <div className="contact-detail-text">
                  <div className="contact-detail-label">Phone 2</div>
                  <div className="contact-detail-value">9821838123</div>
                </div>
              </div>
              
              <div className="contact-detail-item">
                <div className="contact-icon-wrapper">
                  <FaEnvelope size={18} />
                </div>
                <div className="contact-detail-text">
                  <div className="contact-detail-label">Email</div>
                  <div className="contact-detail-value">himalayahomes@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;