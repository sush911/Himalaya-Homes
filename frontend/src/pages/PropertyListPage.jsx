import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContactInfo, listProperties, reportProperty, toggleFavorite } from "../api/property";
import { Modal, Button } from "react-bootstrap";
import AdvancedSearchBar from "../components/AdvancedSearchBar";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const PropertyCard = ({ item, onFavorite, onReport, onContact }) => {
  const mainImage = item.media?.propertyPhotos?.[0] || "https://via.placeholder.com/400x300";
  const isFavorite = false; // TODO: Check from user's favorites list

  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <img
          src={mainImage}
          className="card-img-top"
          alt={item.title}
          style={{ height: "250px", objectFit: "cover" }}
          onError={(e) => (e.target.src = "https://via.placeholder.com/400x300")}
        />
        <span className="badge bg-primary position-absolute top-0 start-0 m-2">
          For {item.listingType === "sale" ? "Sale" : "Rent"}
        </span>
        <span className="badge bg-dark position-absolute top-0 end-0 m-2">
          {item.propertyType}
        </span>
        <button
          className="btn btn-sm position-absolute bottom-0 end-0 m-2"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavorite(item._id);
          }}
        >
          <FaHeart style={{ color: isFavorite ? "red" : "gray" }} />
        </button>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{item.title}</h5>
        <p className="text-muted mb-2">
          <FaMapMarkerAlt /> {item.location?.address}, {item.location?.city}
        </p>
        <p className="fw-bold mb-2 text-primary">Rs {item.price?.toLocaleString()}</p>
        
        <div className="mb-2">
          <small className="text-muted">
            {item.bedrooms > 0 && (
              <span className="me-2">
                <FaBed /> {item.bedrooms} Beds
              </span>
            )}
            {item.bathrooms > 0 && (
              <span className="me-2">
                <FaBath /> {item.bathrooms} Baths
              </span>
            )}
            {item.floors > 0 && (
              <span className="me-2">{item.floors} Floors</span>
            )}
          </small>
        </div>

        {item.area && (
          <div className="mb-2">
            <small className="text-muted">
              <FaRulerCombined />{" "}
              {item.area.sqft && `${item.area.sqft} sqft`}
              {item.area.ana && `, ${item.area.ana} Ana`}
              {item.area.ropani && `, ${item.area.ropani} Ropani`}
            </small>
          </div>
        )}

        {item.constructionYear && (
          <small className="text-muted d-block mb-2">Built: {item.constructionYear}</small>
        )}

        {item.description && (
          <p className="card-text small text-muted mb-2" style={{ 
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {item.description}
          </p>
        )}

        <div className="mt-auto d-flex gap-2 flex-wrap">
          <Link to={`/property/${item._id}`} className="btn btn-primary btn-sm flex-grow-1">
            View Details
          </Link>
          <Button variant="outline-primary" size="sm" onClick={() => onContact(item._id)}>
            Contact
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onReport(item._id)}>
            Report
          </Button>
        </div>
      </div>
    </div>
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
        
        // Apply price filters client-side
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

  // Apply price filters when they change
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
      // Try direct input
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

  return (
    <div className="container py-4">
      <h2 className="mb-4">{listingType === "sale" ? "Buy" : "Rent"} Properties</h2>
      
      {/* Advanced Search Bar */}
      <div className="mb-4">
        <AdvancedSearchBar onSearch={handleSearch} />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="alert alert-info">
          <h5>No properties found</h5>
          <p>Try adjusting your search filters.</p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-3">Found {filteredItems.length} property(ies)</p>
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div className="col-md-4 col-lg-4" key={item._id}>
                <PropertyCard
                  item={item}
                  onFavorite={handleFavorite}
                  onReport={handleReport}
                  onContact={handleContact}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <ContactModal show={showContact} onHide={() => setShowContact(false)} contact={contactInfo} />
    </div>
  );
};

export default PropertyListPage;
