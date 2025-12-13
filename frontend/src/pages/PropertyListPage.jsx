import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { getContactInfo, listProperties, reportProperty, toggleFavorite } from "../api/property";
import { Modal, Button } from "react-bootstrap";
import AdvancedSearchBar from "../components/AdvancedSearchBar";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const COLORS = {
  primary: "#2B5BBA",
  dark: "#1E3A5F",
  gray: "#F5F5F5",
  text: "#333333",
  border: "#E0E0E0",
};

const CATEGORY_FILTERS = [
  { label: "All", value: "" },
  { label: "House", value: "house" },
  { label: "Land", value: "land" },
  { label: "Apartment", value: "apartment" },
  { label: "Building", value: "building" },
];

const PropertyCard = ({ item, onFavorite, onReport, onContact }) => {
  const mainImage = item.media?.propertyPhotos?.[0] || "https://via.placeholder.com/400x300";
  const isFavorite = false;

  return (
    <>
      <style>{`
        .property-card {
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        
        .property-image-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: #f0f0f0;
        }
        
        .property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .property-card:hover .property-image {
          transform: scale(1.05);
        }
        
        .property-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: ${COLORS.primary};
          color: #fff;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .property-type-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .favorite-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .favorite-btn:hover {
          transform: scale(1.1);
          background: #fff;
        }
        
        .property-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
        }
        
        .property-price {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        
        .property-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .property-location {
          font-size: 13px;
          color: #888;
          margin-bottom: 14px;
          display: flex;
          align-items: flex-start;
          gap: 4px;
          line-height: 1.4;
        }
        
        .property-features {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
          font-size: 13px;
          color: #666;
          flex-wrap: wrap;
        }
        
        .property-feature-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .property-area {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .property-built {
          display: none;
        }
        
        .property-description {
          display: none;
        }
        
        .property-actions {
          margin-top: auto;
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 6px;
        }
        
        .btn-view-details {
          height: 36px;
          background: ${COLORS.primary};
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .btn-view-details:hover {
          background: ${COLORS.dark};
          color: #fff;
        }
        
        .btn-contact {
          height: 36px;
          padding: 0 14px;
          background: #fff;
          border: 1.5px solid ${COLORS.primary};
          border-radius: 8px;
          color: ${COLORS.primary};
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-contact:hover {
          background: ${COLORS.primary};
          color: #fff;
        }
        
        .btn-report {
          height: 36px;
          padding: 0 14px;
          background: #fff;
          border: 1.5px solid #dc3545;
          border-radius: 8px;
          color: #dc3545;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-report:hover {
          background: #dc3545;
          color: #fff;
        }
      `}</style>
      
      <div className="property-card">
        <div className="property-image-wrapper">
          <img
            src={mainImage}
            className="property-image"
            alt={item.title}
            onError={(e) => (e.target.src = "https://via.placeholder.com/400x300")}
          />
          <span className="property-badge">
            {item.listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
          <span className="property-type-badge">
            {item.propertyType}
          </span>
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite(item._id);
            }}
          >
            <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
          </button>
        </div>
        
        <div className="property-card-body">
          <h5 className="property-title">{item.title}</h5>
          
          <div className="property-location">
            <FaMapMarkerAlt />
            {item.location?.address}, {item.location?.city}
          </div>
          
          <div className="property-price">
            Rs {item.price?.toLocaleString()}
          </div>
          
          <div className="property-features">
            {item.bedrooms > 0 && (
              <div className="property-feature-item">
                <FaBed /> {item.bedrooms} Beds
              </div>
            )}
            {item.bathrooms > 0 && (
              <div className="property-feature-item">
                <FaBath /> {item.bathrooms} Baths
              </div>
            )}
            {item.floors > 0 && (
              <div className="property-feature-item">
                {item.floors} Floors
              </div>
            )}
          </div>

          {item.area && (
            <div className="property-area">
              <FaRulerCombined />
              {item.area.sqft && `${item.area.sqft} sqft`}
              {item.area.ana && `, ${item.area.ana} Ana`}
              {item.area.ropani && `, ${item.area.ropani} Ropani`}
            </div>
          )}

          {item.constructionYear && (
            <div className="property-built">Built: {item.constructionYear}</div>
          )}

          {item.description && (
            <p className="property-description">{item.description}</p>
          )}

          <div className="property-actions">
            <Link to={`/property/${item._id}`} className="btn-view-details">
              View Details
            </Link>
            <button className="btn-contact" onClick={() => onContact(item._id)}>
              Contact
            </button>
            <button className="btn-report" onClick={() => onReport(item._id)}>
              Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ContactModal = ({ show, onHide, contact }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Owner Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {contact ? (
        <div>
          <p><strong>Name:</strong> {contact.name}</p>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Modal.Body>
  </Modal>
);

const PropertyListPage = ({ listingType }) => {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    priceMin: "",
    priceMax: "",
    search: "",
  });

  const locationHook = useLocation();

  // Initialize filters from URL query params when page loads
  useEffect(() => {
    const qs = new URLSearchParams(locationHook.search);
    const fromQs = {
      propertyType: qs.get("propertyType") || "",
      location: qs.get("location") || qs.get("city") || "",
      priceMin: qs.get("priceMin") || "",
      priceMax: qs.get("priceMax") || "",
      search: qs.get("search") || "",
    };
    setFilters((prev) => ({ ...prev, ...fromQs }));
  }, [locationHook.search]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { listingType };
        if (filters.propertyType) params.propertyType = filters.propertyType.toLowerCase();
        if (filters.location) params.city = filters.location;
        if (filters.search) params.search = filters.search;
        
        const res = await listProperties(params);
        let properties = res.data || [];
        
        if (filters.priceMin) {
          properties = properties.filter(p => p.price >= Number(filters.priceMin));
        }
        if (filters.priceMax) {
          properties = properties.filter(p => p.price <= Number(filters.priceMax));
        }
        
        setItems(properties);
        setFilteredItems(properties);
      } catch (err) {
        console.error("Failed to load properties:", err);
        setItems([]);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [listingType, filters.propertyType, filters.location, filters.search]);

  useEffect(() => {
    let filtered = [...items];
    
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= Number(filters.priceMax));
    }
    
    setFilteredItems(filtered);
  }, [filters.priceMin, filters.priceMax, items]);

  const handleSearch = (searchFilters) => {
    setFilters({
      ...filters,
      ...searchFilters,
    });
  };

  const handleFavorite = async (id) => {
    if (!token) return alert("Login required");
    try {
      await toggleFavorite(id, token);
      alert("Updated saved property");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update favorite");
    }
  };

  const handleReport = async (id) => {
    if (!token) return alert("Login required");
    const reason = window.prompt("Select reason:\n1. fraudulent\n2. suspicious\n3. scam\n\nEnter the number (1, 2, or 3):");
    if (!reason) return;
    
    let reportReason;
    if (reason === "1") reportReason = "fraudulent";
    else if (reason === "2") reportReason = "suspicious";
    else if (reason === "3") reportReason = "scam";
    else {
      const normalized = reason.toLowerCase().trim();
      if (["fraudulent", "suspicious", "scam"].includes(normalized)) {
        reportReason = normalized;
      } else {
        alert("Invalid reason. Please use: fraudulent, suspicious, or scam");
        return;
      }
    }
    
    try {
      await reportProperty(id, reportReason, token);
      alert("Property reported successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to report");
    }
  };

  const handleContact = async (id) => {
    if (!token) return alert("Login required");
    try {
      const res = await getContactInfo(id, token);
      setContactInfo(res.data);
      setShowContact(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to get contact info");
    }
  };

  const activeCategory = useMemo(() => filters.propertyType || "", [filters.propertyType]);

  const handleCategorySelect = (value) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: value,
    }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .property-list-container {
          padding: 32px 20px;
          background: #fafbfc;
          min-height: 100vh;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .page-header-left {
          flex: 1;
        }
        
        .page-subtitle {
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 12px;
          color: #999;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: ${COLORS.dark};
          margin: 0;
          letter-spacing: -0.5px;
        }
        
        .results-badge {
          background: ${COLORS.gray};
          color: ${COLORS.text};
          border: 1px solid ${COLORS.border};
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .category-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        
        .category-btn {
          padding: 10px 24px;
          border-radius: 25px;
          border: 2px solid ${COLORS.border};
          background: #fff;
          color: ${COLORS.text};
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .category-btn:hover {
          border-color: ${COLORS.primary};
          color: ${COLORS.primary};
        }
        
        .category-btn.active {
          background: ${COLORS.primary};
          border-color: ${COLORS.primary};
          color: #fff;
        }
        
        .search-section {
          margin-bottom: 32px;
        }
        
        .loading-spinner {
          text-align: center;
          padding: 80px 20px;
        }
        
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid ${COLORS.gray};
          border-top-color: ${COLORS.primary};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .no-results {
          text-align: center;
          padding: 60px 20px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }
        
        .no-results h5 {
          font-size: 24px;
          font-weight: 700;
          color: ${COLORS.dark};
          margin-bottom: 12px;
        }
        
        .no-results p {
          font-size: 16px;
          color: #666;
        }
        
        .results-count {
          font-size: 15px;
          color: #666;
          margin-bottom: 24px;
          font-weight: 500;
        }
        
        .property-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        
        @media (max-width: 1200px) {
          .property-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .property-list-container {
            padding: 24px 16px;
          }
          
          .page-title {
            font-size: 26px;
          }
          
          .property-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="property-list-container container">
        <div className="page-header">
          <div className="page-header-left">
            <p className="page-subtitle">
              {listingType === "sale" ? "BUY" : "RENT"} PAGE
            </p>
            <h2 className="page-title">Latest Properties</h2>
          </div>
          <div>
            <span className="results-badge">
              Showing {filteredItems.length} listing(s)
            </span>
          </div>
        </div>

        <div className="category-filters">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value || "all"}
                className={`category-btn ${isActive ? "active" : ""}`}
                onClick={() => handleCategorySelect(cat.value)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="search-section">
          <AdvancedSearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p style={{ marginTop: 16, color: "#666" }}>Loading properties...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="no-results">
            <h5>No properties found</h5>
            <p>Try adjusting your search filters.</p>
          </div>
        ) : (
          <>
            {/* New arrivals (3 newest) */}
            {items && items.length > 0 && (
              <div className="mb-4">
                <h5>New Arrivals</h5>
                <div className="row g-3 mb-3">
                  {items
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
                    .map((n) => (
                      <div className="col-md-4" key={n._id}>
                        <div className="card">
                          <img src={n.media?.propertyPhotos?.[0] || "https://via.placeholder.com/400x300"} className="card-img-top" style={{ height: 180, objectFit: "cover" }} />
                          <div className="card-body">
                            <h6 className="card-title">{n.title}</h6>
                            <p className="mb-1 small text-muted">Rs {n.price?.toLocaleString()}</p>
                            <a className="btn btn-sm btn-primary" href={`/property/${n._id}`}>View</a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <p className="results-count">Found {filteredItems.length} property(ies)</p>
            <div className="property-grid">
              {filteredItems.map((item) => (
                <PropertyCard
                  key={item._id}
                  item={item}
                  onFavorite={handleFavorite}
                  onReport={handleReport}
                  onContact={handleContact}
                />
              ))}
            </div>
          </>
        )}
        
        <ContactModal show={showContact} onHide={() => setShowContact(false)} contact={contactInfo} />
      </div>
    </>
  );
};

export default PropertyListPage;

