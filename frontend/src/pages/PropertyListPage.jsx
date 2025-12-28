import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { getContactInfo, listProperties, reportProperty, toggleFavorite } from "../api/property";
import { Modal } from "react-bootstrap";
import AdvancedSearchBar from "../components/AdvancedSearchBar";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaBuilding, FaStar, FaPhone, FaEnvelope, FaUser, FaCheckCircle } from "react-icons/fa";
import "../styles/PropertyListPage.css";

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
  const firstPhoto = item.media?.propertyPhotos?.[0];
  const mainImage = (typeof firstPhoto === 'object' ? firstPhoto.original : firstPhoto) || "/placeholder-property.jpg";
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setIsFavorite(!isFavorite);
    setTimeout(() => setIsAnimating(false), 600);
    onFavorite(item._id);
  };

  return (
    <div className="property-card-compact">
      <div className="property-image-wrapper-compact">
        <img src={mainImage} className="property-image-compact" alt={item.title} onError={(e) => (e.target.style.display = "none")} />
        {item.isVerified && (
          <div className="verified-badge-compact">
            <FaCheckCircle size={16} className="verified-icon" />
            Verified
          </div>
        )}
        <button className={`favorite-btn-compact ${isAnimating ? 'animate' : ''}`} onClick={handleFavoriteClick}>
          <FaHeart size={18} className={`favorite-icon ${isFavorite ? 'active' : ''}`} />
        </button>
      </div>
      
      <div className="property-card-body-compact">
        <div className="rating-stars-compact">
          {item.averageRating ? (
            <>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className={star <= Math.round(item.averageRating) ? 'star-rating' : 'star-rating empty'} />
              ))}
              <span className="rating-text">
                {item.averageRating.toFixed(1)} ({item.totalReviews})
              </span>
            </>
          ) : (
            <span className="no-rating-text">No ratings</span>
          )}
        </div>

        <div className="property-price-compact">Rs {item.price?.toLocaleString()}</div>

        <h5 className="property-title-compact">{item.title}</h5>
        
        <div className="property-location-compact">
          <FaMapMarkerAlt size={12} />
          <span>{item.location?.address}, {item.location?.city}</span>
        </div>
        
        <div className="property-features-compact">
          {item.bedrooms > 0 && (
            <div className="property-feature-item-compact">
              <FaBed /> {item.bedrooms}
            </div>
          )}
          {item.bathrooms > 0 && (
            <div className="property-feature-item-compact">
              <FaBath /> {item.bathrooms}
            </div>
          )}
          {item.floors > 0 && (
            <div className="property-feature-item-compact">
              <FaBuilding /> {item.floors}
            </div>
          )}
          {item.area && item.area.sqft && (
            <div className="property-feature-item-compact">
              <FaRulerCombined /> {item.area.sqft}
            </div>
          )}
        </div>

        <div className="property-actions-compact">
          <Link to={`/property/${item._id}`} className="btn-details-compact">View Details</Link>
          <button className="btn-icon-compact" onClick={() => onContact(item._id)} title="Contact"><FaPhone size={12} /></button>
          <button className="btn-icon-compact btn-report-compact" onClick={() => onReport(item._id)} title="Report">⚠️</button>
        </div>
      </div>
    </div>
  );
};

const ContactModal = ({ show, onHide, contact }) => (
  <Modal show={show} onHide={onHide} centered className="modal-enhanced">
    <Modal.Header closeButton>
      <Modal.Title><FaUser /> Owner Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {contact ? (
        <div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper"><FaUser size={20} /></div>
            <div className="contact-info-text">
              <div className="contact-info-label">Name</div>
              <div className="contact-info-value">{contact.name}</div>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper"><FaEnvelope size={20} /></div>
            <div className="contact-info-text">
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">{contact.email}</div>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon-wrapper"><FaPhone size={20} /></div>
            <div className="contact-info-text">
              <div className="contact-info-label">Phone</div>
              <div className="contact-info-value">{contact.phone}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <div className="spinner-border loading-spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="loading-text">Loading contact information...</p>
        </div>
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
  const [filters, setFilters] = useState({ propertyType: "", location: "", priceMin: "", priceMax: "", search: "" });
  const locationHook = useLocation();

  useEffect(() => {
    const qs = new URLSearchParams(locationHook.search);
    const fromQs = { propertyType: qs.get("propertyType") || "", location: qs.get("location") || qs.get("city") || "", priceMin: qs.get("priceMin") || "", priceMax: qs.get("priceMax") || "", search: qs.get("search") || "" };
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
        if (filters.priceMin) properties = properties.filter(p => p.price >= Number(filters.priceMin));
        if (filters.priceMax) properties = properties.filter(p => p.price <= Number(filters.priceMax));
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
    if (filters.priceMin) filtered = filtered.filter(p => p.price >= Number(filters.priceMin));
    if (filters.priceMax) filtered = filtered.filter(p => p.price <= Number(filters.priceMax));
    setFilteredItems(filtered);
  }, [filters.priceMin, filters.priceMax, items]);

  const handleSearch = (searchFilters) => { setFilters({ ...filters, ...searchFilters }); };
  const handleFavorite = async (id) => { if (!token) return alert("Login required"); try { await toggleFavorite(id, token); alert("Updated saved property"); } catch (err) { alert(err?.response?.data?.message || "Failed to update favorite"); } };
  const handleReport = async (id) => { if (!token) return alert("Login required"); const reason = window.prompt("Select reason:\n1. fraudulent\n2. suspicious\n3. scam\n\nEnter the number (1, 2, or 3):"); if (!reason) return; let reportReason; if (reason === "1") reportReason = "fraudulent"; else if (reason === "2") reportReason = "suspicious"; else if (reason === "3") reportReason = "scam"; else { const normalized = reason.toLowerCase().trim(); if (["fraudulent", "suspicious", "scam"].includes(normalized)) { reportReason = normalized; } else { alert("Invalid reason. Please use: fraudulent, suspicious, or scam"); return; } } try { await reportProperty(id, reportReason, token); alert("Property reported successfully"); } catch (err) { alert(err?.response?.data?.message || "Failed to report"); } };
  const handleContact = async (id) => { if (!token) return alert("Login required"); try { const res = await getContactInfo(id, token); setContactInfo(res.data); setShowContact(true); } catch (err) { alert(err?.response?.data?.message || "Failed to get contact info"); } };
  const activeCategory = useMemo(() => filters.propertyType || "", [filters.propertyType]);
  const handleCategorySelect = (value) => { setFilters((prev) => ({ ...prev, propertyType: value })); };

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      
      @keyframes heartPulse { 0% { transform: scale(1); } 25% { transform: scale(1.3); } 50% { transform: scale(1.1); } 75% { transform: scale(1.4); } 100% { transform: scale(1); } }
      @keyframes cardFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      
      .property-list-page-compact { padding: 32px 20px; background: #FFFFFF; min-height: 100vh; }
      .page-top-compact { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
      .page-title-compact { font-size: 28px; font-weight: 800; color: ${COLORS.dark}; margin: 0; letter-spacing: -0.5px; }
      .results-badge-compact { background: ${COLORS.primary}; color: #fff; padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; }
      
      .filter-pills-compact { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
      .pill-btn-compact { padding: 10px 24px; border-radius: 20px; border: 2px solid ${COLORS.border}; background: #fff; color: ${COLORS.text}; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
      .pill-btn-compact:hover { border-color: ${COLORS.primary}; background: ${COLORS.primary}; color: #fff; transform: translateY(-2px); }
      .pill-btn-compact.active { background: ${COLORS.primary}; border-color: ${COLORS.primary}; color: #fff; }
      
      .search-bar-section-compact { margin-bottom: 28px; }
      
      .loading-area-compact { text-align: center; padding: 60px 20px; }
      .spinner-compact { width: 40px; height: 40px; border: 4px solid ${COLORS.gray}; border-top-color: ${COLORS.primary}; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
      @keyframes spin { to { transform: rotate(360deg); } }
      
      .empty-state-compact { text-align: center; padding: 50px 20px; background: ${COLORS.gray}; border-radius: 12px; }
      .empty-state-compact h5 { font-size: 20px; font-weight: 700; color: ${COLORS.dark}; margin-bottom: 8px; }
      
      .results-info-compact { font-size: 14px; color: #666; margin-bottom: 20px; font-weight: 500; }
      
      .properties-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
      
      .property-card-compact { background: #fff; border: 1px solid ${COLORS.border}; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(95, 86, 86, 0.06); animation: cardFadeIn 0.5s ease; }
      .property-card-compact:hover { transform: translateY(-6px); box-shadow: 0 8px 20px rgba(43, 91, 186, 0.15); border-color: ${COLORS.primary}; }
      
      .property-image-wrapper-compact { position: relative; height: 180px; overflow: hidden; background: ${COLORS.gray}; }
      .property-image-compact { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
      .property-card-compact:hover .property-image-compact { transform: scale(1.08); }
      
      .verified-badge-compact { position: absolute; top: 12px; left: 12px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3); animation: badgeSlideIn 0.4s ease; }
      @keyframes badgeSlideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      
      .favorite-btn-compact { position: absolute; top: 12px; right: 12px; width: 40px; height: 40px; background: rgba(60, 60, 60, 0.75); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(8px); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); }
      .favorite-btn-compact:hover { transform: scale(1.1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); background: rgba(80, 80, 80, 0.85); }
      .favorite-btn-compact.animate { animation: heartPulse 0.6s ease; }
      
      .favorite-icon { color: #fff; transition: all 0.3s ease; }
      .favorite-icon.active { color: #ff4444; }
      
      .property-card-body-compact { padding: 14px; display: flex; flex-direction: column; flex: 1; }
      
      .rating-stars-compact { display: flex; gap: 3px; margin-bottom: 8px; }
      
      .property-price-compact { font-size: 18px; font-weight: 800; color: ${COLORS.dark}; letter-spacing: -0.3px; margin-bottom: 8px; }
      
      .property-title-compact { font-size: 14px; font-weight: 700; color: ${COLORS.text}; margin: 0 0 8px 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
      
      .property-location-compact { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #666; margin-bottom: 10px; }
      .property-location-compact svg { color: ${COLORS.primary}; }
      
      .property-features-compact { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; padding: 10px; background: ${COLORS.gray}; border-radius: 8px; }
      .property-feature-item-compact { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: ${COLORS.text}; }
      .property-feature-item-compact svg { color: ${COLORS.primary}; font-size: 12px; }
      
      .property-actions-compact { margin-top: auto; display: flex; gap: 6px; padding-top: 12px; border-top: 1px solid ${COLORS.border}; }
      .btn-details-compact { flex: 1; height: 34px; background: ${COLORS.primary}; color: #fff; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
      .btn-details-compact:hover { background: ${COLORS.dark}; color: #fff; transform: translateY(-1px); }
      .btn-icon-compact { width: 34px; height: 34px; background: #fff; border: 2px solid ${COLORS.primary}; border-radius: 8px; color: ${COLORS.primary}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
      .btn-icon-compact:hover { background: ${COLORS.primary}; color: #fff; transform: translateY(-1px); }
      .btn-report-compact { border-color: #dc3545; color: #dc3545; }
      .btn-report-compact:hover { background: #dc3545; color: #fff; }
      
      .modal-enhanced .modal-content { border-radius: 16px; border: none; }
      .modal-enhanced .modal-header { background: ${COLORS.dark}; color: #fff; padding: 20px 24px; border: none; }
      .modal-enhanced .modal-title { font-weight: 700; font-size: 1.3rem; display: flex; align-items: center; gap: 10px; }
      .modal-enhanced .btn-close { filter: brightness(0) invert(1); }
      .modal-enhanced .modal-body { padding: 24px; }
      
      .contact-info-item { display: flex; align-items: center; gap: 14px; padding: 14px; background: ${COLORS.gray}; border-radius: 10px; margin-bottom: 14px; transition: all 0.3s ease; }
      .contact-info-item:hover { background: rgba(43, 91, 186, 0.08); transform: translateX(4px); }
      .contact-info-item:last-child { margin-bottom: 0; }
      .contact-icon-wrapper { width: 44px; height: 44px; background: ${COLORS.primary}; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
      .contact-info-text { flex: 1; }
      .contact-info-label { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
      .contact-info-value { font-size: 15px; color: ${COLORS.text}; font-weight: 700; }
      
      @media (max-width: 1400px) { .properties-grid-compact { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 992px) { .properties-grid-compact { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 768px) {
        .property-list-page-compact { padding: 20px 16px; }
        .page-title-compact { font-size: 24px; }
        .properties-grid-compact { grid-template-columns: 1fr; }
      }
    `}</style>
    
    <div className="property-list-page-compact container">
      <div className="page-top-compact">
        <h2 className="page-title-compact">Latest Properties</h2>
        <span className="results-badge-compact">Showing {filteredItems.length} listings</span>
      </div>
      
      <div className="filter-pills-compact">
        {CATEGORY_FILTERS.map((cat) => (
          <button key={cat.value || "all"} className={`pill-btn-compact ${activeCategory === cat.value ? "active" : ""}`} onClick={() => handleCategorySelect(cat.value)}>{cat.label}</button>
        ))}
      </div>
      
      <div className="search-bar-section-compact">
        <AdvancedSearchBar onSearch={handleSearch} />
      </div>
      
      {loading ? (
        <div className="loading-area-compact">
          <div className="spinner-compact"></div>
          <p className="loading-properties-text">Loading properties...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state-compact">
          <h5>No properties found</h5>
          <p>Try adjusting your search filters.</p>
        </div>
      ) : (
        <>
          {locationHook.pathname === "/" && items && items.length > 0 && (
            <div className="mb-4">
              <h5>New Arrivals</h5>
              <div className="row g-3 mb-3">
                {items.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).map((n) => (
                  <div className="col-md-4" key={n._id}>
                    <div className="card">
                      <img 
                        src={(typeof n.media?.propertyPhotos?.[0] === 'object' ? n.media.propertyPhotos[0].original : n.media?.propertyPhotos?.[0]) || "/placeholder-property.jpg"} 
                        className="card-img-top property-card-image" 
                        alt={n.title} 
                      />
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
          
          <p className="results-info-compact">Found {filteredItems.length} property(ies)</p>
          <div className="properties-grid-compact">
            {filteredItems.map((item) => (
              <PropertyCard key={item._id} item={item} onFavorite={handleFavorite} onReport={handleReport} onContact={handleContact} />
            ))}
          </div>
        </>
      )}
      
      <ContactModal show={showContact} onHide={() => setShowContact(false)} contact={contactInfo} />
    </div>
  </>);
};

export default PropertyListPage;




