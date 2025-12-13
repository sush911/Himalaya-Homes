import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Homepage.css";
import heroImg from "../assets/Home.png";
import AdvancedSearchBar from "../components/AdvancedSearchBar";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";
import { listProperties } from "../api/property";

const Homepage = () => {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNew = async () => {
      setLoading(true);
      try {
        const res = await listProperties({ listingType: "sale" });
        const props = Array.isArray(res.data) ? res.data : res.data?.properties || [];
        const sorted = props.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const top = sorted.slice(0, 3).map(normalizeProperty);
        setNewArrivals(top);
      } catch (err) {
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };
    loadNew();
  }, []);

  const normalizeProperty = (p) => ({
    _id: p._id || p.id,
    title: p.title || p.name || "Untitled Property",
    price: p.price || p.rent || 0,
    listingType: p.listingType || (p.rent ? "rent" : "sale"),
    propertyType: p.propertyType || p.type || "Property",
    images: (p.images && p.images.length) ? p.images : (p.media?.propertyPhotos || []).map((url) => ({ url })),
    location: p.location || p.address || { city: p.city || "", country: p.country || "" },
    bedrooms: p.bedrooms ?? p.bed ?? "-",
    bathrooms: p.bathrooms ?? p.bath ?? "-",
    area: p.area || { value: p.size || "-", unit: p.unit || "sqft" },
  });

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
          <p className="hero-subtitle">Buy, Sell, Rent and Explore Properties in Nepal</p>

          <div className="mt-4">
            <AdvancedSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">New Arrivals</h3>
          <a href="/buy" className="text-decoration-none">View all</a>
        </div>

        <div className="row g-3">
          {loading ? (
            <div className="col-12"><div className="text-center py-4">Loading...</div></div>
          ) : newArrivals.length === 0 ? (
            <div className="col-12"><div className="alert alert-info">No new properties</div></div>
          ) : (
            newArrivals.map((p) => <PropertyCard key={p._id} property={p} />)
          )}
        </div>
      </section>

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
