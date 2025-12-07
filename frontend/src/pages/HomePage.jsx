import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Homepage.css";
// assets used elsewhere
import heroImg from "../assets/Home.png";
import AdvancedSearchBar from "../components/AdvancedSearchBar";

const Homepage = () => {

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

          {/* Advanced Search Bar Inside Hero */}
          <div className="mt-4">
            <AdvancedSearchBar />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-white py-4">
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
