import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import profileImg from "../assets/profile.png";
import { getMe } from "../api/auth";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      try {
        const res = await getMe(token);
        setIsAdmin(res.data.role === "admin");
      } catch (err) {
        setIsAdmin(false);
      }
    })();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    navigate("/");
  };

  // 50% less big than before
  const navTextStyle = { fontSize: "1.15rem" };

  // Himalaya Homes brand text bigger
  const brandTextStyle = { fontSize: "1.6rem", fontWeight: "600" };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid d-flex justify-content-start p-0">
        <Link to="/" className="navbar-brand d-flex align-items-center" style={brandTextStyle}>
          <img src={logo} alt="Himalaya Homes" className="navbar-logo" style={{ minHeight: "100px" }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-center m-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={navTextStyle}>
                {t('home')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/buy" style={navTextStyle}>
                {t('buy')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/rent" style={navTextStyle}>
                {t('rent')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sell" style={navTextStyle}>
                {t('sell')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agents" style={navTextStyle}>
                {t('agents')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" style={navTextStyle}>
                {t('contact')}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/saved" style={navTextStyle}>
                {t('saved')} ❤️
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin" style={navTextStyle}>
                  {t('adminPanel')} 🔧
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="nav-action-bar d-flex align-items-center m-0">
              <Link
                to="/my-listings"
                className="action-link"
                style={navTextStyle}
              >
                {t('myListings')}
              </Link>

              {!token && (
                <>
                  <Link
                    to="/login"
                    className="action-btn action-outline me-2"
                    style={navTextStyle}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="action-btn action-primary"
                    style={navTextStyle}
                  >
                    {t('signup')}
                  </Link>
                </>
              )}
            </div>

            {token && (
              <button
                className="action-btn"
                onClick={handleLogout}
                style={{
                  ...navTextStyle,
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#c82333';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#dc3545';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {t('logout')}
              </button>
            )}
          </div>
        </div>

        {/* Language Toggle & Profile */}
        <div className="navbar-profile d-flex align-items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="language-toggle-btn"
            title={t('language')}
            style={{
              background: 'linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(43, 91, 186, 0.2)',
              minWidth: '60px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(43, 91, 186, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(43, 91, 186, 0.2)';
            }}
          >
            🌐 {language === 'en' ? 'नेपाली' : 'EN'}
          </button>
          {token && (
            <Link to="/profile">
              <img
                src={profileImg}
                alt="Profile"
                className="profile-thumb profile-thumb--large"
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
