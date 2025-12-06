import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Homepage.css";
import logo from "../assets/logo.png";
import profileIcon from "../assets/profile.png";
import heroImg from "../assets/Home.png";

const Homepage = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="homepage">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="Logo" className="logo-img" />
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto align-items-center">
              {["Buy","Sell","Rent","Agents","Contact Us","Saved Properties ❤️","My Listings"].map(item => {
                const key = item.toLowerCase().replace(/\s+/g, "");
                // hide long labels on small screens
                const hideSm = item.includes('Saved') || item.includes('My Listings') || item.includes('Contact');
                return (
                  <li className={`nav-item nav-long ${hideSm ? 'hide-sm' : ''}`} key={item}>
                    <a className="nav-link nav-link-lg" href={`/${key}`}>{item}</a>
                  </li>
                );
              })}
            </ul>

            <div className="d-flex align-items-center">
              {!user ? (
                <>
                  <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>Login</button>
                  <button className="btn btn-outline-primary me-3" onClick={() => navigate("/signup")}>Signup</button>
                </>
              ) : (
                <>
                  <img
                    src={user.profilePicture || profileIcon}
                    alt="Profile"
                    className="profile-icon-navbar"
                    style={{cursor: "pointer"}}
                    onClick={() => navigate("/profile")}
                  />
                  <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero-section d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          color: "#FFFFFF",
        }}
      >
        <div className="hero-overlay p-4" style={{backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "15px"}}>
          <h1 style={{color: "#FFFFFF", fontSize: "4rem", fontWeight: 700}}>Himalaya Homes</h1>
          <p style={{color: "#F8FAFC", fontSize: "1.3rem"}}>Buy, Sell, Rent and Explore Properties in Nepal</p>

          {/* Unified Search Bar */}
          <div className="search-bar-wrapper mt-4">
            <form className="d-flex justify-content-center align-items-center">
              <input
                type="text"
                placeholder="Search location, city, area..."
                className="form-control me-2"
                style={{width: "min(560px, 60%)"}}
              />
              <button className="btn btn-primary px-4">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-properties py-5 bg-gray">
        <div className="container">
          <h2 className="text-dark-blue mb-5 text-center">Featured Properties</h2>
          <div className="row justify-content-center g-4">
            {[1,2,3].map((p) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={p}>
                <div className="card shadow-sm h-100">
                  <img src={heroImg} className="card-img-top" alt="Property" />
                  <div className="card-body d-flex flex-column">
                    <h5 style={{color: "#1E3A5F"}}>Beautiful Villa</h5>
                    <p style={{color: "#333333"}}>Kathmandu, Nepal</p>
                    <button className="btn btn-primary mt-auto">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-white py-4" style={{backgroundColor: "#2B5BBA"}}>
        <div className="container d-flex justify-content-between flex-wrap">
          <div><p className="mb-0">Thamel, Kathmandu</p></div>
          <div className="text-end">
            <p className="mb-1">Himalayahomes@gmail.com</p>
            <p className="mb-0">98882882</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
