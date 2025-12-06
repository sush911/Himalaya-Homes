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
          <img src={logo} alt="Himalaya Homes" className="navbar-logo" />
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
            <li className="nav-item"><Link className="nav-link" to="/my-listings">My Listings</Link></li>
          </ul>

          <div className="d-flex ms-3 align-items-center">
            {!token ? (
              <>
                <Link to="/login" className="btn btn-outline-custom me-2">Login</Link>
                <Link to="/signup" className="btn btn-primary-custom">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/profile">
                  <img src={profileImg} alt="Profile" className="profile-thumb" />
                </Link>
                <button className="btn btn-primary-custom" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

