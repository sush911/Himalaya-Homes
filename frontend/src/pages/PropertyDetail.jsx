import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getPropertyById, getContactInfo, toggleFavorite, reportProperty, addReview } from "../api/property";
import { Modal, Carousel } from "react-bootstrap";
import { 
  FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaStar, 
  FaCheckCircle, FaPhone, FaEnvelope, FaUser, FaImage, 
  FaFlag, FaParking, FaBuilding, FaCalendar 
} from "react-icons/fa";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data);
        
        const images = [];
        if (res.data.media?.propertyPhotos?.length) {
          images.push(...res.data.media.propertyPhotos.map(url => ({ url, type: "property" })));
        }
        if (res.data.media?.lalpurjaPhotos?.length) {
          images.push(...res.data.media.lalpurjaPhotos.map(url => ({ url, type: "lalpurja" })));
        }
        if (res.data.media?.roadPhotos?.length) {
          images.push(...res.data.media.roadPhotos.map(url => ({ url, type: "road" })));
        }
        setGalleryImages(images);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to load property");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id, navigate]);

  const handleContact = async () => {
    if (!token) return alert("Login required");
    try {
      const res = await getContactInfo(id, token);
      setContactInfo(res.data);
      setShowContact(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to get contact info");
    }
  };

  const handleFavorite = async () => {
    if (!token) return alert("Login required");
    try {
      await toggleFavorite(id, token);
      setIsFavorited(!isFavorited);
      alert("Updated saved property");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update favorite");
    }
  };

  const handleReport = async () => {
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

  const openGallery = (startIndex = 0) => {
    setGalleryStartIndex(startIndex);
    setShowGallery(true);
  };

  const handleSubmitReview = async () => {
    if (!token) return alert("Login required");
    if (!rating) return alert("Please select a rating");

    setSubmittingReview(true);
    try {
      const res = await addReview(id, rating, "", token);
      setProperty(res.data.property);
      setRating(5);
      alert("Review submitted successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          size={18}
          color={i <= count ? '#ffc107' : '#ddd'}
          style={{ cursor: 'pointer' }}
          onClick={() => setRating(i)}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #4A90E2', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h4>Property not found</h4>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '10px 20px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const mainImage = property.media?.propertyPhotos?.[0] || "https://via.placeholder.com/800x600";
  const coordinates = property.location?.coordinates;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .figma-property-detail {
          font-family: 'Poppins', sans-serif;
          background: #FAFBFC;
          min-height: 100vh;
          padding: 20px;
        }

        .figma-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .figma-badge {
          display: inline-block;
          padding: 6px 16px;
          background: #4A90E2;
          color: white;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .figma-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 8px 0;
          line-height: 1.3;
        }

        .figma-price {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 12px 0 20px 0;
        }

        .figma-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 30px;
        }

        .figma-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .figma-main-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .figma-main-image:hover {
          transform: scale(1.02);
        }

        .figma-right {
          display: flex;
          flex-direction: column;
          height: 500px;
        }

        .figma-tabs {
          display: flex;
          gap: 40px;
          border-bottom: 2px solid #e0e0e0;
          margin-bottom: 20px;
        }

        .figma-tab {
          padding: 12px 0;
          font-size: 18px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          transition: all 0.3s;
        }

        .figma-tab.active {
          color: #1a1a1a;
          border-bottom-color: #4A90E2;
        }

        .figma-tab-content {
          flex: 1;
          overflow-y: auto;
        }

        .figma-photos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          height: 100%;
        }

        .figma-photo-item {
          position: relative;
          height: 180px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .figma-photo-item:hover {
          transform: scale(1.05);
        }

        .figma-photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .figma-show-all {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 15px;
          text-align: center;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .figma-video-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
          max-height: 100%;
          overflow-y: auto;
        }

        .figma-video {
          width: 100%;
          height: 200px;
          border-radius: 8px;
          object-fit: cover;
        }

        .figma-map-container {
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
        }

        .figma-actions {
          display: flex;
          gap: 15px;
          margin: 15px 0 20px 0;
          align-items: center;
        }

        .figma-btn {
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .figma-btn-primary {
          background: #4A90E2;
          color: white;
        }

        .figma-btn-primary:hover {
          background: #357ABD;
        }

        .figma-btn-outline {
          background: white;
          border: 2px solid #e0e0e0;
          color: #666;
        }

        .figma-btn-outline:hover {
          border-color: #4A90E2;
          color: #4A90E2;
        }

        .figma-rating-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
        }

        .figma-rating-stars {
          display: flex;
          gap: 3px;
        }

        .figma-rating-count {
          font-size: 13px;
          color: #666;
        }

        .figma-verified {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #4A90E2;
          font-size: 14px;
          font-weight: 600;
        }

        .figma-report {
          margin-left: auto;
          color: #666;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .figma-report:hover {
          color: #ff4444;
        }

        .figma-details-section {
          background: white;
          padding: 30px;
          border-radius: 16px;
          margin-top: 25px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e8eaed;
        }

        .figma-section-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 25px;
          padding-bottom: 0;
          border-bottom: none;
        }

        .figma-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid #e8eaed;
          border-radius: 12px;
          overflow: hidden;
        }

        .figma-detail-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          padding: 20px 24px;
          background: white;
          border-right: 1px solid #e8eaed;
          border-bottom: 1px solid #e8eaed;
          transition: all 0.2s;
          position: relative;
        }

        .figma-detail-item:nth-child(3n) {
          border-right: none;
        }

        .figma-detail-item:hover {
          background: #f8f9fa;
        }

        .figma-detail-icon {
          color: #666;
          font-size: 20px;
          margin-bottom: 4px;
        }

        .figma-detail-text {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .figma-detail-label {
          font-size: 13px;
          color: #6c757d;
          font-weight: 500;
        }

        .figma-detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          word-wrap: break-word;
        }

        .figma-detail-full-width {
          grid-column: 1 / -1;
          border-right: none;
          border-bottom: none;
        }

        .figma-nearby-section {
          background: white;
          padding: 30px;
          border-radius: 16px;
          margin-top: 25px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e8eaed;
        }

        .figma-nearby-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .figma-nearby-category h4 {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 0;
          border-bottom: none;
        }

        .figma-nearby-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .figma-nearby-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s;
        }

        .figma-nearby-list li:hover {
          color: #4A90E2;
          padding-left: 8px;
        }

        .figma-nearby-list li:last-child {
          border-bottom: none;
        }

        .figma-nearby-list li span:first-child {
          font-weight: 400;
          color: #1a1a1a;
        }

        .figma-nearby-list li span:last-child {
          font-size: 13px;
          color: #6c757d;
          font-weight: 500;
        }

        .figma-description-section {
          background: white;
          padding: 30px;
          border-radius: 16px;
          margin-top: 25px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e8eaed;
        }

        .figma-description-text {
          font-size: 15px;
          line-height: 1.7;
          color: #495057;
          white-space: pre-wrap;
        }



        @media (max-width: 968px) {
          .figma-layout {
            grid-template-columns: 1fr;
          }

          .figma-details-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .figma-nearby-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .figma-title {
            font-size: 24px;
          }

          .figma-price {
            font-size: 22px;
          }

          .figma-details-grid {
            grid-template-columns: 1fr;
          }

          .figma-detail-item {
            border-right: none;
          }

          .figma-photos-grid {
            grid-template-columns: 1fr;
          }

          .figma-video-container {
            grid-template-columns: 1fr;
          }

          .figma-details-section,
          .figma-nearby-section,
          .figma-description-section {
            padding: 24px;
          }
        }

          .figma-video-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="figma-property-detail">
        <div className="figma-container">
          {/* Top: Title and Badge */}
          <div style={{ marginBottom: '20px' }}>
            <span className="figma-badge">
              For {property.listingType === "sale" ? "sale" : "rent"}
            </span>
            <h1 className="figma-title">{property.title}</h1>
            {property.location?.address && (
              <div style={{ fontSize: '15px', color: '#666', marginTop: '8px' }}>
                {property.location.address}, {property.location.city}
              </div>
            )}
          </div>

          {/* Image Section - Left: Main Image, Right: Show All + Map */}
          <div className="figma-layout">
            {/* Left Side - Main Image */}
            <div className="figma-left">
              <img
                src={mainImage}
                alt={property.title}
                className="figma-main-image"
                onClick={() => openGallery(0)}
              />
            </div>

            {/* Right Side - Show All Photos + Map */}
            <div className="figma-right" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Show All Photos Button */}
              <div 
                style={{ 
                  height: '240px', 
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundImage: galleryImages[1] ? `url(${galleryImages[1].url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
                onClick={() => openGallery(0)}
              >
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'rgba(0,0,0,0.5)', 
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaImage size={32} color="white" />
                  <div style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginTop: '12px' }}>
                    Show all
                  </div>
                  <div style={{ color: 'white', fontSize: '14px', marginTop: '4px' }}>
                    {galleryImages.length} photos
                  </div>
                </div>
              </div>

              {/* Map */}
              {coordinates && (
                <div style={{ height: '245px', borderRadius: '12px', overflow: 'hidden' }}>
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OSM</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[coordinates.lat, coordinates.lng]}>
                      <Popup>{property.location?.address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          </div>

          {/* Price and Actions Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', marginBottom: '25px' }}>
            {/* Left: Price */}
            <div className="figma-price">Rs {property.price?.toLocaleString()} crore</div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button className="figma-btn figma-btn-primary" onClick={handleContact}>
                CONTACT US
              </button>
              <button 
                className={`figma-btn figma-btn-outline ${isFavorited ? 'favorited' : ''}`} 
                onClick={handleFavorite}
                style={{ padding: '10px 15px' }}
              >
                <FaHeart color={isFavorited ? '#ff4444' : '#666'} />
              </button>
              <div className="figma-rating-box">
                <div className="figma-rating-stars">
                  {[1, 2, 3, 4, 5].map(i => (
                    <FaStar 
                      key={i} 
                      size={16} 
                      color={i <= Math.round(property.averageRating || 0) ? '#ffc107' : '#e0e0e0'} 
                    />
                  ))}
                </div>
                <span className="figma-rating-count">{property.totalReviews || 0} Reviews</span>
              </div>
              {property.isVerified && (
                <div className="figma-verified">
                  <FaCheckCircle /> Verified
                </div>
              )}
              <div className="figma-report" onClick={handleReport}>
                <FaFlag /> Report
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="figma-details-section">
            <h3 className="figma-section-title">Property details</h3>
            <div className="figma-details-grid">
              {/* Total Area */}
              {(property.area?.sqft || property.area?.ana || property.area?.ropani) && (
                <div className="figma-detail-item">
                  <FaRulerCombined className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Total area</span>
                    <span className="figma-detail-value">
                      {property.area?.sqft ? `${property.area.sqft} sq ft` : ''}
                      {property.area?.ana ? (property.area?.sqft ? ` (${property.area.ana} Ana)` : `${property.area.ana} Ana`) : ''}
                      {property.area?.ropani ? ` ${property.area.ropani} Ropani` : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Bedrooms */}
              {property.bedrooms > 0 && (
                <div className="figma-detail-item">
                  <FaBed className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Bedrooms</span>
                    <span className="figma-detail-value">{property.bedrooms}</span>
                  </div>
                </div>
              )}

              {/* Bathrooms */}
              {property.bathrooms > 0 && (
                <div className="figma-detail-item">
                  <FaBath className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Bathrooms</span>
                    <span className="figma-detail-value">{property.bathrooms}</span>
                  </div>
                </div>
              )}

              {/* Floors */}
              {property.floors > 0 && (
                <div className="figma-detail-item">
                  <FaBuilding className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Floors</span>
                    <span className="figma-detail-value">{property.floors}</span>
                  </div>
                </div>
              )}

              {/* Parking */}
              {property.parking > 0 && (
                <div className="figma-detail-item">
                  <FaParking className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Parking</span>
                    <span className="figma-detail-value">Yes</span>
                  </div>
                </div>
              )}

              {/* Construction Year */}
              {property.constructionYear && (
                <div className="figma-detail-item">
                  <FaCalendar className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Construction year</span>
                    <span className="figma-detail-value">{property.constructionYear}</span>
                  </div>
                </div>
              )}

              {/* City */}
              {property.location?.city && (
                <div className="figma-detail-item">
                  <FaMapMarkerAlt className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">City</span>
                    <span className="figma-detail-value">{property.location.city}</span>
                  </div>
                </div>
              )}

              {/* Province */}
              {property.location?.province && (
                <div className="figma-detail-item">
                  <FaMapMarkerAlt className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Province</span>
                    <span className="figma-detail-value">{property.location.province}</span>
                  </div>
                </div>
              )}

              {/* Address - Full Width */}
              {property.location?.address && (
                <div className="figma-detail-item figma-detail-full-width">
                  <FaMapMarkerAlt className="figma-detail-icon" />
                  <div className="figma-detail-text">
                    <span className="figma-detail-label">Address</span>
                    <span className="figma-detail-value">{property.location.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What's Nearby */}
          {property.nearby && (
            <div className="figma-nearby-section">
              <h3 className="figma-section-title">What's nearby</h3>
              <div className="figma-nearby-grid">
                {property.nearby.education?.length > 0 && (
                  <div className="figma-nearby-category">
                    <h4>📚 Education</h4>
                    <ul className="figma-nearby-list">
                      {property.nearby.education.slice(0, 3).map((place, idx) => (
                        <li key={idx}>
                          <span>{place.name}</span>
                          <span>{place.distanceKm > 0 ? `${place.distanceKm} km` : '0.089 km'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {property.nearby.food?.length > 0 && (
                  <div className="figma-nearby-category">
                    <h4>🍽️ Food</h4>
                    <ul className="figma-nearby-list">
                      {property.nearby.food.slice(0, 3).map((place, idx) => (
                        <li key={idx}>
                          <span>{place.name}</span>
                          <span>{place.distanceKm > 0 ? `${place.distanceKm} km` : '0.089 km'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {property.nearby.health?.length > 0 && (
                  <div className="figma-nearby-category">
                    <h4>🏥 Health & Medicine</h4>
                    <ul className="figma-nearby-list">
                      {property.nearby.health.slice(0, 3).map((place, idx) => (
                        <li key={idx}>
                          <span>{place.name}</span>
                          <span>{place.distanceKm > 0 ? `${place.distanceKm} km` : '0.089 km'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="figma-nearby-category">
                  <h4>🎭 Culture</h4>
                  <ul className="figma-nearby-list">
                    <li>
                      <span>Nepal Mandala</span>
                      <span>0.089 mile</span>
                    </li>
                    <li>
                      <span>Durbar Square</span>
                      <span>0.028 mile</span>
                    </li>
                    <li>
                      <span>Pashupatinath</span>
                      <span>0.059 mile</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="figma-description-section">
              <h3 className="figma-section-title">Description</h3>
              <p className="figma-description-text">{property.description}</p>
            </div>
          )}


        </div>
      </div>

      {/* Gallery Modal */}
      <Modal show={showGallery} onHide={() => setShowGallery(false)} size="xl" centered>
        <Modal.Header closeButton style={{ background: '#4A90E2', color: 'white', border: 'none' }}>
          <Modal.Title style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaImage />Photo Gallery
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#000', padding: 0 }}>
          <Carousel activeIndex={galleryStartIndex} onSelect={(idx) => setGalleryStartIndex(idx)} interval={null}>
            {galleryImages.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100"
                  src={img.url}
                  alt={`Gallery ${idx + 1}`}
                  style={{ maxHeight: "70vh", objectFit: "contain" }}
                />
                <Carousel.Caption style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '8px 16px' }}>
                  <small style={{ textTransform: 'capitalize', fontWeight: '600' }}>{img.type} Photo</small>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>

      {/* Contact Modal */}
      <Modal show={showContact} onHide={() => setShowContact(false)} centered>
        <Modal.Header closeButton style={{ background: '#4A90E2', color: 'white', border: 'none' }}>
          <Modal.Title style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUser /> Owner Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '30px' }}>
          {contactInfo ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: '#4A90E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaUser size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Name</div>
                  <div style={{ fontSize: '16px', color: '#333', fontWeight: '700' }}>{contactInfo.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: '#4A90E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaEnvelope size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Email</div>
                  <div style={{ fontSize: '16px', color: '#333', fontWeight: '700' }}>{contactInfo.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ width: '50px', height: '50px', background: '#4A90E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaPhone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>Phone</div>
                  <div style={{ fontSize: '16px', color: '#333', fontWeight: '700' }}>{contactInfo.phone}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '48px', height: '48px', border: '5px solid #f3f3f3', borderTop: '5px solid #4A90E2', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
              <p style={{ marginTop: '16px', color: '#666', fontWeight: '600' }}>Loading contact information...</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Rating Modal - Optional */}
      {token && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, maxWidth: '300px' }}>
          <h6 style={{ marginBottom: '15px', fontWeight: '700' }}>Rate this property</h6>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            {renderStars(rating)}
          </div>
          <button
            onClick={handleSubmitReview}
            disabled={submittingReview}
            style={{ width: '100%', padding: '10px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            {submittingReview ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      )}
    </>
  );
};

export default PropertyDetail;
