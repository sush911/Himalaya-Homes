import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProperties, getMyRequests } from "../api/property";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTimesCircle, FaLayerGroup } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const COLORS = {
  primary: "#2B5BBA",
  dark: "#1E3A5F",
  gray: "#F5F5F5",
  text: "#333333",
  border: "#E0E0E0",
};

const PropertyCard = ({ property, isRequest = false }) => {
  const { t } = useLanguage();
  const firstPhoto = property.media?.propertyPhotos?.[0];
  const mainImage = (typeof firstPhoto === 'object' ? firstPhoto.original : firstPhoto) || "https://via.placeholder.com/400x300";

  return (
    <div className="property-card-compact">
      <div className="property-image-wrapper-compact">
        <img src={mainImage} className="property-image-compact" alt={property.title} onError={(e) => (e.target.src = "https://via.placeholder.com/400x300")} />
        <div className="status-badge-overlay">
          {isRequest ? (
            property.status === "approved" ? (
              <span className="badge-approved"><FaCheckCircle /> Approved</span>
            ) : property.status === "rejected" ? (
              <span className="badge-rejected"><FaTimesCircle /> Rejected</span>
            ) : (
              <span className="badge-pending"><FaClock /> Pending</span>
            )
          ) : (
            <span className="badge-live">🟢 Live</span>
          )}
        </div>
        <span className="listing-type-badge">
          For {property.listingType === "sale" ? "Sale" : "Rent"}
        </span>
      </div>
      
      <div className="property-card-body-compact">
        <div className="property-price-compact">Rs {property.price?.toLocaleString()}</div>
        <h5 className="property-title-compact">{property.title}</h5>
        
        <div className="property-location-compact">
          <FaMapMarkerAlt size={12} />
          <span>{property.location?.address}, {property.location?.city}</span>
        </div>
        
        <div className="property-features-compact">
          {property.bedrooms > 0 && (
            <div className="property-feature-item-compact">
              <FaBed /> <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="property-feature-item-compact">
              <FaBath /> <span>{property.bathrooms}</span>
            </div>
          )}
          {property.floors > 0 && (
            <div className="property-feature-item-compact">
              <FaLayerGroup /> <span>{property.floors}</span>
            </div>
          )}
          {property.area && property.area.sqft && (
            <div className="property-feature-item-compact">
              <FaRulerCombined /> <span>{property.area.sqft}</span>
            </div>
          )}
        </div>

        <div className="property-actions-compact">
          <Link to={`/property/${property._id}`} className="btn-details-compact">View Details</Link>
        </div>
      </div>
    </div>
  );
};

const MyListing = () => {
  const token = localStorage.getItem("token");
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live"); // "live" or "pending"

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propsRes, reqRes] = await Promise.all([
        getMyProperties(token),
        getMyRequests(token),
      ]);
      setProperties(propsRes.data || []);
      
      // Filter out approved requests (they're already in properties)
      const pendingOrRejected = (reqRes.data || []).filter(r => r.status !== "approved");
      setRequests(pendingOrRejected);
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Please login to view your listings.</div>
      </div>
    );
  }

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      
      .my-listing-page { padding: 32px 20px; background: #FFFFFF; min-height: 100vh; }
      
      .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
      .page-title { font-size: 28px; font-weight: 800; color: ${COLORS.dark}; margin: 0; letter-spacing: -0.5px; }
      
      .tabs-container { display: flex; gap: 12px; margin-bottom: 24px; background: ${COLORS.gray}; padding: 8px; border-radius: 12px; }
      .tab-btn { flex: 1; padding: 12px 24px; border-radius: 8px; border: none; background: transparent; color: #666; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
      .tab-btn.active { background: ${COLORS.primary}; color: white; box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3); }
      .tab-btn:hover:not(.active) { background: rgba(43, 91, 186, 0.1); }
      .tab-count { background: rgba(255, 255, 255, 0.3); padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 700; }
      
      .properties-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
      
      .property-card-compact { background: #fff; border: 1px solid ${COLORS.border}; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06); }
      .property-card-compact:hover { transform: translateY(-6px); box-shadow: 0 8px 20px rgba(43, 91, 186, 0.15); border-color: ${COLORS.primary}; }
      
      .property-image-wrapper-compact { position: relative; height: 180px; overflow: hidden; background: ${COLORS.gray}; }
      .property-image-compact { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
      .property-card-compact:hover .property-image-compact { transform: scale(1.08); }
      
      .status-badge-overlay { position: absolute; top: 12px; right: 12px; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: flex; align-items: center; gap: 4px; }
      .badge-live { background: rgba(40, 167, 69, 0.95); color: white; }
      .badge-approved { background: rgba(40, 167, 69, 0.95); color: white; }
      .badge-pending { background: rgba(255, 193, 7, 0.95); color: #856404; }
      .badge-rejected { background: rgba(220, 53, 69, 0.95); color: white; }
      
      .listing-type-badge { position: absolute; top: 12px; left: 12px; background: rgba(30, 58, 95, 0.95); color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; backdrop-filter: blur(10px); }
      
      .property-card-body-compact { padding: 14px; display: flex; flex-direction: column; flex: 1; }
      .property-price-compact { font-size: 18px; font-weight: 800; color: ${COLORS.dark}; letter-spacing: -0.3px; margin-bottom: 8px; }
      .property-title-compact { font-size: 14px; font-weight: 700; color: ${COLORS.text}; margin: 0 0 8px 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
      .property-location-compact { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #666; margin-bottom: 10px; }
      .property-location-compact svg { color: ${COLORS.primary}; }
      .property-features-compact { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; padding: 12px; background: ${COLORS.gray}; border-radius: 8px; }
      .property-feature-item-compact { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; font-weight: 600; color: ${COLORS.text}; padding: 6px; background: #fff; border-radius: 6px; }
      .property-feature-item-compact svg { color: ${COLORS.primary}; font-size: 16px; }
      .property-feature-item-compact span { font-size: 14px; font-weight: 700; }
      .property-actions-compact { margin-top: auto; display: flex; gap: 6px; padding-top: 12px; border-top: 1px solid ${COLORS.border}; }
      .btn-details-compact { flex: 1; height: 34px; background: ${COLORS.primary}; color: #fff; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
      .btn-details-compact:hover { background: ${COLORS.dark}; color: #fff; transform: translateY(-1px); }
      
      .loading-area-compact { text-align: center; padding: 60px 20px; }
      .spinner-compact { width: 40px; height: 40px; border: 4px solid ${COLORS.gray}; border-top-color: ${COLORS.primary}; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
      @keyframes spin { to { transform: rotate(360deg); } }
      
      .empty-state-compact { text-align: center; padding: 50px 20px; background: ${COLORS.gray}; border-radius: 12px; }
      .empty-state-compact h5 { font-size: 20px; font-weight: 700; color: ${COLORS.dark}; margin-bottom: 8px; }
      .empty-state-compact p { color: #666; }
      
      @media (max-width: 1400px) { .properties-grid-compact { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 992px) { .properties-grid-compact { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 768px) {
        .my-listing-page { padding: 20px 16px; }
        .page-title { font-size: 24px; }
        .properties-grid-compact { grid-template-columns: 1fr; }
        .notification-dropdown { width: calc(100vw - 40px); right: 20px; }
      }
    `}</style>
    
    <div className="my-listing-page container">
      <div className="page-header">
        <h2 className="page-title">My Listings</h2>
      </div>
      
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === "live" ? "active" : ""}`}
          onClick={() => setActiveTab("live")}
        >
          🟢 Live Properties
          {properties.length > 0 && <span className="tab-count">{properties.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <FaClock /> Pending Requests
          {requests.length > 0 && <span className="tab-count">{requests.length}</span>}
        </button>
      </div>
      
      {loading ? (
        <div className="loading-area-compact">
          <div className="spinner-compact"></div>
          <p>Loading your properties...</p>
        </div>
      ) : activeTab === "live" ? (
        properties.length === 0 ? (
          <div className="empty-state-compact">
            <h5>No live properties</h5>
            <p>Your approved properties will appear here. Submit a property from the Sell page!</p>
          </div>
        ) : (
          <div className="properties-grid-compact">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} isRequest={false} />
            ))}
          </div>
        )
      ) : (
        requests.length === 0 ? (
          <div className="empty-state-compact">
            <h5>No pending requests</h5>
            <p>Submit a property from the Sell page to see it here.</p>
          </div>
        ) : (
          <div className="properties-grid-compact">
            {requests.map((r) => (
              <PropertyCard key={r._id} property={r} isRequest={true} />
            ))}
          </div>
        )
      )}
    </div>
  </>);
};

export default MyListing;
