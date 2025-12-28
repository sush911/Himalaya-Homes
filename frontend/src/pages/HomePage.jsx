import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Homepage.css";
import heroImg from "../assets/Home.png";
import AdvancedSearchBar from "../components/AdvancedSearchBar";
import PropertyCardCompact from "../components/PropertyCardCompact";
import { useNavigate } from "react-router-dom";
import { listProperties, toggleFavorite } from "../api/property";
import { useLanguage } from "../context/LanguageContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadNew = async () => {
      setLoading(true);
      try {
        const res = await listProperties({ listingType: "sale" });
        const props = Array.isArray(res.data) ? res.data : res.data?.properties || [];
        const sorted = props.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const top = sorted.slice(0, 3);
        setNewArrivals(top);
      } catch (err) {
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };
    loadNew();
  }, []);

  const handleFavorite = async (propertyId) => {
    if (!token) {
      alert("Please login to save favorites");
      return;
    }
    try {
      await toggleFavorite(propertyId, token);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.propertyType) params.set("propertyType", filters.propertyType);
    if (filters.location) params.set("location", filters.location);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    navigate(`/buy${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <div className="homepage">
      <section
        className="hero-section d-flex align-items-center justify-content-center text-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay p-4">
          <h1 className="hero-title">Himalaya Homes</h1>
          <p className="hero-subtitle">{t('buySellRent')}</p>

          <div className="mt-4">
            <AdvancedSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0" style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A5F' }}>{t('newArrivals')}</h3>
          <a href="/buy" className="text-decoration-none" style={{ color: '#2B5BBA', fontWeight: '600', fontSize: '15px' }}>{t('viewAll')}</a>
        </div>

        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <div className="text-center py-5">
                <div style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #2B5BBA', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                <p style={{ marginTop: '16px', color: '#666', fontWeight: '600' }}>{t('loading')}</p>
              </div>
            </div>
          ) : newArrivals.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info" style={{ borderRadius: '12px', border: '1px solid #bee5eb' }}>{t('noNewProperties')}</div>
            </div>
          ) : (
            newArrivals.map((p) => (
              <div key={p._id} className="col-lg-4 col-md-6">
                <PropertyCardCompact item={p} onFavorite={handleFavorite} showActions={false} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
