import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Homepage.css";
// assets used elsewhere
import heroImg from "../assets/Home.png";

const Homepage = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="homepage">

      {/* Navbar is provided globally by `components/Navbar` */}

      {/* HERO */}
      <section
        className="hero-section d-flex align-items-center justify-content-center text-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay p-4">
          <h1 className="hero-title">Himalaya Homes</h1>
          <p className="hero-subtitle">Buy, Sell, Rent and Explore Properties in Nepal</p>

          {/* Unified Search Bar */}
          <div className="search-bar-wrapper mt-4">
            <form className="d-flex justify-content-center align-items-center">
              <input
                type="text"
                placeholder="Search location, city, area..."
                className="form-control me-2 search-input"
              />
              <button className="btn btn-primary px-4">Search</button>
            </form>
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
