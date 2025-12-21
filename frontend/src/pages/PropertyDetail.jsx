import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getPropertyById, getContactInfo, toggleFavorite, reportProperty, addReview, getReviews } from "../api/property";
import { Modal, Button, Carousel, Form } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaStar, FaCheckCircle, FaPhone, FaEnvelope, FaUser, FaArrowLeft, FaImage, FaVideo, FaFlag, FaHome } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const PropertyDetail = () => {
  const { t } = useLanguage();
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
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data);
        
        const images = [];
        if (res.data.media?.lalpurjaPhotos?.length) {
          images.push(...res.data.media.lalpurjaPhotos.map(url => ({ url, type: "lalpurja" })));
        }
        if (res.data.media?.propertyPhotos?.length) {
          images.push(...res.data.media.propertyPhotos.map(url => ({ url, type: "property" })));
        }
        if (res.data.media?.roadPhotos?.length) {
          images.push(...res.data.media.roadPhotos.map(url => ({ url, type: "road" })));
        }
        setGalleryImages(images);
        
        try {
          const reviewRes = await getReviews(id);
          setReviews(reviewRes.data.reviews || []);
        } catch (err) {
          console.error("Failed to load reviews");
        }
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
      setReviews(res.data.property.reviews || []);
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
          size={20}
          color={i <= count ? '#ffc107' : '#ddd'}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onClick={() => setRating(i)}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container-enhanced">
        <div className="spinner-enhanced"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5">
        <div className="alert-enhanced alert-danger">
          <h4>Property not found</h4>
          <p>The property you're looking for doesn't exist or has been removed.</p>
        </div>
        <button className="btn-back-enhanced" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  const mainImage = property.media?.propertyPhotos?.[0] || "https://via.placeholder.com/800x600";
  const coordinates = property.location?.coordinates;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .property-detail-page-enhanced {
          background: linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }

        .loading-container-enhanced {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 20px;
        }

        .spinner-enhanced {
          width: 64px;
          height: 64px;
          border: 6px solid #F5F5F5;
          border-top-color: #2B5BBA;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .btn-back-enhanced {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: white;
          border: 2px solid #E0E0E0;
          border-radius: 12px;
          font-weight: 700;
          color: #333;
          transition: all 0.3s ease;
          margin-bottom: 24px;
          animation: fadeInDown 0.5s ease;
        }

        .btn-back-enhanced:hover {
          background: #2B5BBA;
          border-color: #2B5BBA;
          color: white;
          transform: translateX(-4px);
          box-shadow: 0 6px 16px rgba(43, 91, 186, 0.3);
        }

        .property-header-enhanced {
          animation: fadeInDown 0.6s ease;
          margin-bottom: 32px;
        }

        .badge-enhanced {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          animation: scaleIn 0.5s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .badge-primary-enhanced {
          background: linear-gradient(135deg, #2B5BBA 0%, #4A7FDB 100%);
          color: white;
        }

        .badge-success-enhanced {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }

        .property-title-enhanced {
          font-size: 3rem;
          font-weight: 900;
          color: #1E3A5F;
          letter-spacing: -1px;
          margin: 16px 0;
          line-height: 1.2;
        }

        .property-location-enhanced {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 16px;
        }

        .property-location-enhanced svg {
          color: #2B5BBA;
        }

        .property-price-enhanced {
          font-size: 2.5rem;
          font-weight: 900;
          color: #2B5BBA;
          margin: 16px 0;
        }

        .action-buttons-enhanced {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          animation: slideInRight 0.6s ease;
        }

        .btn-action-enhanced {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
        }

        .btn-favorite-enhanced {
          background: white;
          border: 2px solid #E0E0E0;
          color: #666;
        }

        .btn-favorite-enhanced.favorited {
          border-color: #ff4757;
          color: #ff4757;
          background: #fff5f7;
        }

        .btn-favorite-enhanced.favorited svg {
          color: #ff4757;
          animation: heartPulse 0.4s ease;
        }

        .btn-favorite-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          border-color: #ff4757;
          color: #ff4757;
        }

        .btn-report-enhanced {
          background: white;
          border: 2px solid #ffc107;
          color: #ffc107;
        }

        .btn-report-enhanced:hover {
          background: #ffc107;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
        }

        .btn-contact-primary {
          background: linear-gradient(135deg, #2B5BBA 0%, #4A7FDB 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }

        .btn-contact-primary:hover {
          background: linear-gradient(135deg, #1E3A5F 0%, #2B5BBA 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(43, 91, 186, 0.4);
        }

        .main-image-enhanced {
          width: 100%;
          max-height: 600px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: scaleIn 0.7s ease;
        }

        .main-image-enhanced:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 48px rgba(43, 91, 186, 0.2);
        }

        .btn-view-gallery {
          margin-top: 16px;
          padding: 12px 28px;
          background: white;
          border: 2px solid #2B5BBA;
          border-radius: 12px;
          color: #2B5BBA;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-view-gallery:hover {
          background: #2B5BBA;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(43, 91, 186, 0.3);
        }

        .card-enhanced {
          background: white;
          border-radius: 16px;
          border: 1px solid #E0E0E0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          margin-bottom: 24px;
          animation: fadeInUp 0.7s ease;
          transition: all 0.3s ease;
        }

        .card-enhanced:hover {
          box-shadow: 0 12px 28px rgba(43, 91, 186, 0.12);
          transform: translateY(-4px);
        }

        .card-header-enhanced {
          background: linear-gradient(135deg, #2B5BBA 0%, #1E3A5F 100%);
          color: white;
          padding: 20px 24px;
          border: none;
        }

        .card-header-enhanced h5 {
          margin: 0;
          font-weight: 800;
          font-size: 1.2rem;
        }

        .card-body-enhanced {
          padding: 24px;
        }

        .property-detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: #F5F5F5;
          border-radius: 10px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }

        .property-detail-row:hover {
          background: #E8F0FE;
          transform: translateX(4px);
        }

        .property-detail-row svg {
          color: #2B5BBA;
          font-size: 20px;
        }

        .property-detail-row strong {
          color: #1E3A5F;
          font-weight: 700;
        }

        .rating-card-enhanced {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 2px solid #E0E0E0;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          animation: slideInRight 0.7s ease;
          transition: all 0.3s ease;
        }

        .rating-card-enhanced:hover {
          border-color: #2B5BBA;
          box-shadow: 0 10px 32px rgba(43, 91, 186, 0.15);
        }

        .rating-display {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .rating-score {
          font-size: 32px;
          font-weight: 900;
          color: #1E3A5F;
        }

        .rating-stars-display {
          display: flex;
          gap: 4px;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .media-item-enhanced {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .media-item-enhanced:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(43, 91, 186, 0.2);
        }

        .media-item-enhanced img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .media-item-enhanced:hover img {
          transform: scale(1.1);
        }

        .media-section-enhanced {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 2px solid #F5F5F5;
        }

        .media-section-enhanced:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .media-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 3px solid #E8F0FE;
        }

        .media-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.2rem;
          font-weight: 800;
          color: #1E3A5F;
        }

        .media-count-badge {
          background: linear-gradient(135deg, #2B5BBA 0%, #4A7FDB 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }

        .professional-media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .professional-media-item {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          background: #f8f9fa;
          aspect-ratio: 4/3;
        }

        .professional-media-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(43, 91, 186, 0.2);
        }

        .professional-media-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .professional-media-item:hover img {
          transform: scale(1.15);
        }

        .media-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(43, 91, 186, 0.85) 0%, rgba(30, 58, 95, 0.85) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .professional-media-item:hover .media-overlay {
          opacity: 1;
        }

        .video-grid-professional {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .professional-video-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: #000;
        }

        .professional-video-container:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(43, 91, 186, 0.25);
        }

        .professional-video {
          width: 100%;
          height: 100%;
          min-height: 320px;
          max-height: 450px;
          object-fit: cover;
          display: block;
        }

        .contact-modal-enhanced .modal-content {
          border-radius: 20px;
          border: none;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .contact-modal-enhanced .modal-header {
          background: linear-gradient(135deg, #1E3A5F 0%, #2B5BBA 100%);
          color: white;
          padding: 24px 28px;
          border: none;
        }

        .contact-modal-enhanced .modal-title {
          font-weight: 800;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-modal-enhanced .btn-close {
          filter: brightness(0) invert(1);
          opacity: 1;
        }

        .contact-info-item-enhanced {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background: #F5F5F5;
          border-radius: 12px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }

        .contact-info-item-enhanced:hover {
          background: #E8F0FE;
          transform: translateX(4px);
        }

        .contact-icon-wrapper-enhanced {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #2B5BBA 0%, #4A7FDB 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .contact-details-enhanced {
          flex: 1;
        }

        .contact-label-enhanced {
          font-size: 12px;
          color: #888;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .contact-value-enhanced {
          font-size: 16px;
          color: #333;
          font-weight: 700;
        }

        .nearby-list {
          list-style: none;
          padding: 0;
        }

        .nearby-list li {
          padding: 10px 14px;
          background: #F5F5F5;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .nearby-list li:hover {
          background: #E8F0FE;
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .property-title-enhanced {
            font-size: 2rem;
          }

          .property-price-enhanced {
            font-size: 1.8rem;
          }

          .action-buttons-enhanced {
            width: 100%;
          }

          .btn-action-enhanced {
            flex: 1;
          }
        }
      `}</style>

      <div className="property-detail-page-enhanced">
        <div className="container">
          <button className="btn-back-enhanced" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Listings
          </button>

          <div className="property-header-enhanced">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">
              <div className="flex-grow-1">
                <div className="d-flex gap-2 mb-3 flex-wrap">
                  <span className="badge-enhanced badge-primary-enhanced">
                    For {property.listingType === "sale" ? "Sale" : "Rent"}
                  </span>
                  {property.isVerified && (
                    <span className="badge-enhanced badge-success-enhanced">
                      <FaCheckCircle /> Verified
                    </span>
                  )}
                </div>

                <h1 className="property-title-enhanced">{property.title}</h1>

                <div className="property-location-enhanced">
                  <FaMapMarkerAlt size={20} />
                  <span>{property.location?.address}, {property.location?.city}, {property.location?.country}</span>
                </div>

                <div className="property-price-enhanced">
                  Rs {property.price?.toLocaleString()}
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="action-buttons-enhanced">
                  <button className={`btn-action-enhanced btn-favorite-enhanced ${isFavorited ? 'favorited' : ''}`} onClick={handleFavorite}>
                    <FaHeart /> Favorite
                  </button>
                  <button className="btn-action-enhanced btn-report-enhanced" onClick={handleReport}>
                    <FaFlag /> Report
                  </button>
                  <button className="btn-action-enhanced btn-contact-primary" onClick={handleContact}>
                    <FaPhone /> Contact
                  </button>
                </div>

                <div className="rating-card-enhanced">
                  <div className="rating-display">
                    <div className="rating-score">
                      {property.averageRating?.toFixed(1) || 'N/A'}
                    </div>
                    <div>
                      <div className="rating-stars-display">
                        {[1, 2, 3, 4, 5].map(i => (
                          <FaStar 
                            key={i} 
                            size={18} 
                            color={i <= Math.round(property.averageRating) ? '#ffc107' : '#e0e0e0'} 
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginTop: '4px' }}>
                        {property.totalReviews || 0} {property.totalReviews === 1 ? 'rating' : 'ratings'}
                      </div>
                    </div>
                  </div>

                  {token ? (
                    <div>
                      <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: '#1E3A5F' }}>
                        Rate this property
                      </label>
                      <div className="d-flex gap-2 mb-3">
                        {renderStars(rating)}
                      </div>
                      <button
                        className="btn-action-enhanced btn-contact-primary w-100"
                        onClick={handleSubmitReview}
                        disabled={submittingReview}
                        style={{ fontSize: '14px' }}
                      >
                        {submittingReview ? "Submitting..." : "Submit Rating"}
                      </button>
                    </div>
                  ) : (
                    <small style={{ color: '#888', fontWeight: '600' }}>
                      <Link to="/login" style={{ color: '#2B5BBA', textDecoration: 'none' }}>Login</Link> to rate this property
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="mb-4">
                <img
                  src={mainImage}
                  alt={property.title}
                  className="main-image-enhanced"
                  onClick={() => openGallery(0)}
                />
                {galleryImages.length > 1 && (
                  <button className="btn-view-gallery" onClick={() => openGallery(0)}>
                    <FaImage /> View All {galleryImages.length} Photos
                  </button>
                )}
              </div>

              <div className="card-enhanced">
                <div className="card-header-enhanced">
                  <h5><FaHome style={{ marginRight: '10px' }} />Property Details</h5>
                </div>
                <div className="card-body-enhanced">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="property-detail-row">
                        <FaHome />
                        <strong>Type:</strong>
                        <span>{property.propertyType}</span>
                      </div>
                      {property.bedrooms > 0 && (
                        <div className="property-detail-row">
                          <FaBed />
                          <strong>Bedrooms:</strong>
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="property-detail-row">
                          <FaBath />
                          <strong>Bathrooms:</strong>
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      {property.floors > 0 && (
                        <div className="property-detail-row">
                          <strong>Floors:</strong>
                          <span>{property.floors}</span>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      {property.parking > 0 && (
                        <div className="property-detail-row">
                          <strong>Parking:</strong>
                          <span>{property.parking}</span>
                        </div>
                      )}
                      {property.constructionYear && (
                        <div className="property-detail-row">
                          <strong>Built:</strong>
                          <span>{property.constructionYear}</span>
                        </div>
                      )}
                      {property.area && (
                        <div className="property-detail-row">
                          <FaRulerCombined />
                          <strong>Area:</strong>
                          <span>
                            {property.area.sqft && `${property.area.sqft} sqft`}
                            {property.area.ana && `, ${property.area.ana} Ana`}
                            {property.area.ropani && `, ${property.area.ropani} Ropani`}
                          </span>
                        </div>
                      )}
                      {property.amenities && property.amenities.length > 0 && (
                        <div className="property-detail-row">
                          <strong>Amenities:</strong>
                          <span>{property.amenities.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {property.description && (
                <div className="card-enhanced">
                  <div className="card-header-enhanced">
                    <h5>Description</h5>
                  </div>
                  <div className="card-body-enhanced">
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: '1.7', color: '#666' }}>{property.description}</p>
                  </div>
                </div>
              )}

              {property.media && (
                <div className="card-enhanced">
                  <div className="card-header-enhanced">
                    <h5><FaImage style={{ marginRight: '10px' }} />Media Gallery</h5>
                  </div>
                  <div className="card-body-enhanced">
                    {property.media.lalpurjaPhotos?.length > 0 && (
                      <div className="media-section-enhanced">
                        <div className="media-section-header">
                          <div className="media-section-title">
                            <FaImage size={18} style={{ color: '#2B5BBA' }} />
                            <span>Lalpurja Documents</span>
                          </div>
                          <span className="media-count-badge">{property.media.lalpurjaPhotos.length}</span>
                        </div>
                        <div className="professional-media-grid">
                          {property.media.lalpurjaPhotos.map((url, idx) => (
                            <div key={idx} className="professional-media-item">
                              <div className="media-overlay">
                                <FaImage size={24} style={{ color: 'white' }} />
                              </div>
                              <img
                                src={url}
                                alt={`Lalpurja ${idx + 1}`}
                                onClick={() => {
                                  const startIdx = galleryImages.findIndex(img => img.url === url);
                                  openGallery(startIdx >= 0 ? startIdx : 0);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {property.media.propertyPhotos?.length > 0 && (
                      <div className="media-section-enhanced">
                        <div className="media-section-header">
                          <div className="media-section-title">
                            <FaImage size={18} style={{ color: '#2B5BBA' }} />
                            <span>Property Photos</span>
                          </div>
                          <span className="media-count-badge">{property.media.propertyPhotos.length}</span>
                        </div>
                        <div className="professional-media-grid">
                          {property.media.propertyPhotos.map((url, idx) => (
                            <div key={idx} className="professional-media-item">
                              <div className="media-overlay">
                                <FaImage size={24} style={{ color: 'white' }} />
                              </div>
                              <img
                                src={url}
                                alt={`Property ${idx + 1}`}
                                onClick={() => {
                                  const startIdx = galleryImages.findIndex(img => img.url === url);
                                  openGallery(startIdx >= 0 ? startIdx : 0);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {property.media.propertyVideos?.length > 0 && (
                      <div className="media-section-enhanced">
                        <div className="media-section-header">
                          <div className="media-section-title">
                            <FaVideo size={18} style={{ color: '#2B5BBA' }} />
                            <span>Property Videos</span>
                          </div>
                          <span className="media-count-badge">{property.media.propertyVideos.length}</span>
                        </div>
                        <div className="video-grid-professional">
                          {property.media.propertyVideos.slice(0, 2).map((url, idx) => (
                            <div key={idx} className="professional-video-container">
                              <video controls className="professional-video">
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {property.media.roadPhotos?.length > 0 && (
                      <div className="media-section-enhanced">
                        <div className="media-section-header">
                          <div className="media-section-title">
                            <FaMapMarkerAlt size={18} style={{ color: '#2B5BBA' }} />
                            <span>Road Access Photos</span>
                          </div>
                          <span className="media-count-badge">{property.media.roadPhotos.length}</span>
                        </div>
                        <div className="professional-media-grid">
                          {property.media.roadPhotos.map((url, idx) => (
                            <div key={idx} className="professional-media-item">
                              <div className="media-overlay">
                                <FaImage size={24} style={{ color: 'white' }} />
                              </div>
                              <img
                                src={url}
                                alt={`Road ${idx + 1}`}
                                onClick={() => {
                                  const startIdx = galleryImages.findIndex(img => img.url === url);
                                  openGallery(startIdx >= 0 ? startIdx : 0);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {property.media.roadVideos?.length > 0 && (
                      <div className="media-section-enhanced">
                        <div className="media-section-header">
                          <div className="media-section-title">
                            <FaVideo size={18} style={{ color: '#2B5BBA' }} />
                            <span>Road Access Videos</span>
                          </div>
                          <span className="media-count-badge">{property.media.roadVideos.length}</span>
                        </div>
                        <div className="video-grid-professional">
                          {property.media.roadVideos.slice(0, 2).map((url, idx) => (
                            <div key={idx} className="professional-video-container">
                              <video controls className="professional-video">
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {property.nearby && (
                <div className="card-enhanced">
                  <div className="card-header-enhanced">
                    <h5><FaMapMarkerAlt style={{ marginRight: '10px' }} />What's Nearby</h5>
                  </div>
                  <div className="card-body-enhanced">
                    <div className="row">
                      {property.nearby.education?.length > 0 && (
                        <div className="col-md-4 mb-3">
                          <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px' }}>🎓 Education</h6>
                          <ul className="nearby-list">
                            {property.nearby.education.slice(0, 3).map((place, idx) => (
                              <li key={idx}>
                                {place.name} {place.distanceKm > 0 && `(${place.distanceKm} km)`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {property.nearby.food?.length > 0 && (
                        <div className="col-md-4 mb-3">
                          <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px' }}>🍽️ Food</h6>
                          <ul className="nearby-list">
                            {property.nearby.food.slice(0, 3).map((place, idx) => (
                              <li key={idx}>
                                {place.name} {place.distanceKm > 0 && `(${place.distanceKm} km)`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {property.nearby.health?.length > 0 && (
                        <div className="col-md-4 mb-3">
                          <h6 style={{ color: '#1E3A5F', fontWeight: '700', marginBottom: '12px' }}>🏥 Health</h6>
                          <ul className="nearby-list">
                            {property.nearby.health.slice(0, 3).map((place, idx) => (
                              <li key={idx}>
                                {place.name} {place.distanceKm > 0 && `(${place.distanceKm} km)`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              {coordinates && (
                <div className="card-enhanced">
                  <div className="card-header-enhanced">
                    <h5><FaMapMarkerAlt style={{ marginRight: '10px' }} />Location</h5>
                  </div>
                  <div className="card-body-enhanced p-0">
                    <div style={{ height: "400px" }}>
                      <MapContainer
                        center={[coordinates.lat, coordinates.lng]}
                        zoom={15}
                        style={{ height: "100%", width: "100%", borderRadius: '0 0 16px 16px' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OSM</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[coordinates.lat, coordinates.lng]}>
                          <Popup>{property.location?.address}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-enhanced">
                <div className="card-header-enhanced">
                  <h5><FaPhone style={{ marginRight: '10px' }} />Contact Owner</h5>
                </div>
                <div className="card-body-enhanced text-center">
                  {token ? (
                    <button className="btn-action-enhanced btn-contact-primary w-100" onClick={handleContact}>
                      <FaPhone /> Contact Us
                    </button>
                  ) : (
                    <>
                      <button className="btn-action-enhanced btn-contact-primary w-100" disabled style={{ opacity: 0.6 }}>
                        <FaPhone /> Contact Us
                      </button>
                      <p className="mt-3" style={{ color: '#ffc107', fontSize: '14px', fontWeight: '600' }}>
                        Please <Link to="/login" style={{ color: '#2B5BBA', textDecoration: 'none' }}>login</Link> to view contact information
                      </p>
                    </>
                  )}
                  {property.postedBy && (
                    <p className="mt-3" style={{ color: '#888', fontSize: '14px', fontWeight: '600' }}>
                      Posted by: {property.postedBy.firstName} {property.postedBy.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showGallery} onHide={() => setShowGallery(false)} size="xl" centered className="gallery-modal-enhanced">
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2B5BBA 100%)', color: 'white', border: 'none' }}>
          <Modal.Title style={{ fontWeight: '800' }}>
            <FaImage style={{ marginRight: '12px' }} />Photo Gallery
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

      <Modal show={showContact} onHide={() => setShowContact(false)} centered className="contact-modal-enhanced">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUser /> Owner Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '32px 28px' }}>
          {contactInfo ? (
            <div>
              <div className="contact-info-item-enhanced">
                <div className="contact-icon-wrapper-enhanced">
                  <FaUser size={22} />
                </div>
                <div className="contact-details-enhanced">
                  <div className="contact-label-enhanced">Name</div>
                  <div className="contact-value-enhanced">{contactInfo.name}</div>
                </div>
              </div>

              <div className="contact-info-item-enhanced">
                <div className="contact-icon-wrapper-enhanced">
                  <FaEnvelope size={22} />
                </div>
                <div className="contact-details-enhanced">
                  <div className="contact-label-enhanced">Email</div>
                  <div className="contact-value-enhanced">{contactInfo.email}</div>
                </div>
              </div>

              <div className="contact-info-item-enhanced">
                <div className="contact-icon-wrapper-enhanced">
                  <FaPhone size={22} />
                </div>
                <div className="contact-details-enhanced">
                  <div className="contact-label-enhanced">Phone</div>
                  <div className="contact-value-enhanced">{contactInfo.phone}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div className="spinner-enhanced" style={{ width: '48px', height: '48px', margin: '0 auto' }}></div>
              <p style={{ marginTop: '16px', color: '#666', fontWeight: '600' }}>Loading contact information...</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PropertyDetail;

