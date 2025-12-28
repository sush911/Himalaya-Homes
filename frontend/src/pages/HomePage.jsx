import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Homepage.css";
import heroImg from "../assets/Home.png";
import AdvancedSearchBar from "../components/AdvancedSearchBar";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";
import { listProperties } from "../api/property";
import { useLanguage } from "../context/LanguageContext";

const Homepage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    images: (p.images && p.images.length) ? p.images : (p.media?.propertyPhotos || []).map((url) => ({ 
      url: typeof url === 'object' ? url.original : url 
    })),
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
          <p className="hero-subtitle">{t('buySellRent')}</p>

          <div className="mt-4">
            <AdvancedSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">{t('newArrivals')}</h3>
          <a href="/buy" className="text-decoration-none">{t('viewAll')}</a>
        </div>

        <div className="row g-3">
          {loading ? (
            <div className="col-12"><div className="text-center py-4">{t('loading')}</div></div>
          ) : newArrivals.length === 0 ? (
            <div className="col-12"><div className="alert alert-info">{t('noNewProperties')}</div></div>
          ) : (
            newArrivals.map((p) => <PropertyCard key={p._id} property={p} />)
          )}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
