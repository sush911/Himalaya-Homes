import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import profileImg from "../assets/profile.png";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Himalaya Homes" className="navbar-logo" style={{ minHeight: "100px" }} />
          <span className="brand-title">Himalaya Homes</span>
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/buy">Buy</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/rent">Rent</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/sell">Sell</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/agents">Agents</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/saved">Saved Properties ❤️</Link></li>
          </ul>

          <div className="nav-action-bar d-flex align-items-center ms-3">
            <Link to="/my-listings" className="action-link me-3">My Listings</Link>

            {!token ? (
              <>
                <Link to="/login" className="action-btn action-outline me-2">Login</Link>
                <Link to="/signup" className="action-btn action-primary">Sign Up</Link>
              </>
            ) : (
              <>
                <button className="action-btn action-primary" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>

        {/* Profile icon positioned separately at the far right */}
        <div className="navbar-profile d-flex align-items-center">
          {token && (
            <Link to="/profile">
              <img src={profileImg} alt="Profile" className="profile-thumb profile-thumb--large" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

