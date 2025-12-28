import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import defaultProfileImg from "../assets/profile.png";
import { getMe } from "../api/auth";
import { useLanguage } from "../context/LanguageContext";
import { useNotifications } from "../context/NotificationContext";
import { FaBell, FaTimes, FaCheck } from "react-icons/fa";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(defaultProfileImg);
  const { language, toggleLanguage, t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, checkPropertyUpdates } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const API_HOST = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const resolveImage = (src) => {
    if (!src) return defaultProfileImg;
    if (src.startsWith('data:') || src.startsWith('http')) return src;
    // Handle both old paths (uploads/properties/) and new paths (uploads/)
    if (src.startsWith('/uploads') || src.startsWith('uploads')) {
      return `${API_HOST}${src.startsWith('/') ? src : '/' + src}`;
    }
    // If it's just a filename, try uploads/ first
    return `${API_HOST}/uploads/${src}`;
  };

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      setUserProfilePic(defaultProfileImg);
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const res = await getMe(token);
        setIsAdmin(res.data.role === "admin");
        // Set user profile picture
        if (res.data.profilePic) {
          const resolvedPic = resolveImage(res.data.profilePic);
          setUserProfilePic(resolvedPic);
          console.log('Profile pic path:', res.data.profilePic);
          console.log('Resolved URL:', resolvedPic);
        } else {
          setUserProfilePic(defaultProfileImg);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setIsAdmin(false);
        setUserProfilePic(defaultProfileImg);
      }
    };
    
    fetchUserData();
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchUserData();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // Refresh profile picture every 30 seconds to catch updates
    const interval = setInterval(fetchUserData, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [token]);

  // Check for property updates every 30 seconds
  useEffect(() => {
    if (!token) return;
    
    checkPropertyUpdates(token);
    const interval = setInterval(() => {
      checkPropertyUpdates(token);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    navigate("/");
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.propertyId) {
      navigate('/my-listings');
      setShowNotifications(false);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Navbar text sizing
  const navTextStyle = { fontSize: "1rem", fontWeight: "600" };

  // Himalaya Homes brand text
  const brandTextStyle = { fontSize: "1.4rem", fontWeight: "600" };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid" style={{ padding: '0.4rem 1.5rem', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
        <Link to="/" className="navbar-brand d-flex align-items-center" style={{ ...brandTextStyle, marginRight: '2rem', flexShrink: 0 }}>
          <img src={logo} alt="Himalaya Homes" className="navbar-logo" style={{ height: "70px", width: "auto" }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ul className="navbar-nav d-flex align-items-center" style={{ gap: '8px', margin: 0, padding: 0, flexWrap: 'nowrap' }}>
            <li className="nav-item" style={{ margin: 0 }}>
              <Link className="nav-link" to="/" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                {t('home')}
              </Link>
            </li>
            <li className="nav-item" style={{ margin: 0 }}>
              <Link className="nav-link" to="/buy" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                {t('buy')}
              </Link>
            </li>
            <li className="nav-item" style={{ margin: 0 }}>
              <Link className="nav-link" to="/rent" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                {t('rent')}
              </Link>
            </li>
            <li className="nav-item" style={{ margin: 0 }}>
              <Link className="nav-link" to="/sell" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                {t('sell')}
              </Link>
            </li>
            <li className="nav-item" style={{ margin: 0 }}>
              <Link className="nav-link" to="/agents" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                {t('agents')}
              </Link>
            </li>
            <li className="nav-item" style={{ margin: 0 }}>
              <Link className="nav-link" to="/contact" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                {t('contact')}
              </Link>
            </li>
            <li className="nav-item" style={{ margin: 0 }}>
              <Link className="nav-link" to="/saved" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                {t('saved')} ❤️
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item" style={{ margin: 0 }}>
                <Link className="nav-link" to="/admin" style={{ ...navTextStyle, padding: '6px 10px', whiteSpace: 'nowrap' }}>
                  {t('adminPanel')} 🔧
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center" style={{ gap: '8px', flexShrink: 0 }}>
            {/* My Listings - moved here for consistent spacing */}
            {token && (
              <Link 
                to="/my-listings" 
                style={{
                  ...navTextStyle,
                  background: 'linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%)',
                  color: 'white',
                  fontWeight: '600',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(43, 91, 186, 0.2)',
                  textDecoration: 'none',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  fontSize: '1.05rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(43, 91, 186, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(43, 91, 186, 0.2)';
                }}
              >
                {t('myListings')}
              </Link>
            )}
            
            {!token ? (
              <>
                <Link
                  to="/login"
                  style={{
                    ...navTextStyle,
                    background: 'linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(43, 91, 186, 0.2)',
                    textDecoration: 'none',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    fontSize: '1.05rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(43, 91, 186, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(43, 91, 186, 0.2)';
                  }}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  style={{
                    ...navTextStyle,
                    background: 'linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(43, 91, 186, 0.2)',
                    textDecoration: 'none',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    fontSize: '1.05rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(43, 91, 186, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(43, 91, 186, 0.2)';
                  }}
                >
                  {t('signup')}
                </Link>
              </>
            ) : (
              <>
                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      background: 'linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(43, 91, 186, 0.2)',
                      position: 'relative'
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
                    <FaBell size={18} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: '#dc3545',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: '2px solid white'
                      }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <>
                      <div 
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999
                        }}
                        onClick={() => setShowNotifications(false)}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '50px',
                        right: '0',
                        width: '380px',
                        maxHeight: '500px',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        zIndex: 1000,
                        overflow: 'hidden'
                      }}>
                        {/* Header */}
                        <div style={{
                          padding: '16px 20px',
                          borderBottom: '2px solid #f0f0f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%)',
                          color: 'white'
                        }}>
                          <span style={{ fontSize: '16px', fontWeight: '700' }}>
                            Notifications {unreadCount > 0 && `(${unreadCount})`}
                          </span>
                          {notifications.length > 0 && (
                            <button
                              onClick={markAllAsRead}
                              style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              <FaCheck size={10} /> Mark all read
                            </button>
                          )}
                        </div>

                        {/* Notifications List */}
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {notifications.length === 0 ? (
                            <div style={{
                              padding: '40px 20px',
                              textAlign: 'center',
                              color: '#999'
                            }}>
                              <FaBell size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                              <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                style={{
                                  padding: '16px 20px',
                                  borderBottom: '1px solid #f0f0f0',
                                  cursor: 'pointer',
                                  background: notif.read ? 'white' : '#f8f9ff',
                                  transition: 'all 0.2s ease',
                                  position: 'relative'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f5ff'}
                                onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'white' : '#f8f9ff'}
                              >
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  marginBottom: '4px'
                                }}>
                                  <span style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#1E3A5F',
                                    flex: 1
                                  }}>
                                    {notif.title}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearNotification(notif.id);
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#999',
                                      cursor: 'pointer',
                                      padding: '0',
                                      marginLeft: '8px'
                                    }}
                                  >
                                    <FaTimes size={12} />
                                  </button>
                                </div>
                                <p style={{
                                  fontSize: '13px',
                                  color: '#666',
                                  margin: '0 0 8px 0',
                                  lineHeight: '1.4'
                                }}>
                                  {notif.message}
                                </p>
                                <span style={{
                                  fontSize: '11px',
                                  color: '#999'
                                }}>
                                  {formatTime(notif.timestamp)}
                                </span>
                                {!notif.read && (
                                  <div style={{
                                    position: 'absolute',
                                    left: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#2B5BBA'
                                  }} />
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="language-toggle-btn"
                  title={t('language')}
                  style={{
                    background: 'linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(43, 91, 186, 0.2)',
                    minWidth: '60px',
                    whiteSpace: 'nowrap'
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

                {/* Profile */}
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={userProfilePic}
                    alt="Profile"
                    style={{
                      height: '48px',
                      width: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block',
                      border: '2px solid #e2e8f0'
                    }}
                    onError={(e) => {
                      console.error('Failed to load profile image:', userProfilePic);
                      e.target.src = defaultProfileImg;
                    }}
                  />
                </Link>
              </>
            )}
            
            {/* Logout Button - Separated at the end (only show when logged in) */}
            {token && (
              <>
                <div style={{ width: '1px', height: '30px', background: '#E0E0E0', margin: '0 8px' }} />
                <button
                  className="action-btn"
                  onClick={handleLogout}
                  style={{
                    ...navTextStyle,
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    fontSize: '0.9rem'
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}



