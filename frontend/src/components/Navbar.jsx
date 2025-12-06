import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--border)"
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="logo"
            style={{ height: "48px", marginRight: "10px" }}
          />
          <h4 className="m-0 fw-bold" style={{ color: "var(--dark-blue)" }}>
            Himalaya Homes
          </h4>
        </Link>

        <div className="ms-auto">
          {!token ? (
            <>
              <Link
                to="/login"
                className="btn btn-outline-primary me-2"
                style={{
                  borderColor: "var(--primary-blue)",
                  color: "var(--primary-blue)"
                }}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn text-white"
                style={{ backgroundColor: "var(--primary-blue)" }}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="btn me-2"
                style={{
                  color: "var(--dark-blue)",
                  fontWeight: "600",
                  backgroundColor: "var(--gray)",
                  border: "1px solid var(--border)"
                }}
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="btn text-white"
                style={{ backgroundColor: "var(--primary-blue)" }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
