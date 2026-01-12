import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaStar, FaCheckCircle, FaHeart, FaLayerGroup, FaPhone } from 'react-icons/fa';

const COLORS = {
  primary: "#2B5BBA",
  dark: "#1E3A5F",
  gray: "#F5F5F5",
  text: "#333333",
  border: "#E0E0E0",
};

const PropertyCardCompact = ({ item, onFavorite, onContact, onReport, showActions = true }) => {
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
    if (onFavorite) onFavorite(item._id);
  };

  return (
    <>
      <style>{`
        @keyframes heartPulse { 0% { transform: scale(1); } 25% { transform: scale(1.3); } 50% { transform: scale(1.1); } 75% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @keyframes cardFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes badgeSlideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        
        .property-card-compact { background: #fff; border: 1px solid ${COLORS.border}; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06); animation: cardFadeIn 0.5s ease; cursor: pointer; }
        .property-card-compact:hover { transform: translateY(-6px); box-shadow: 0 8px 20px rgba(43, 91, 186, 0.15); border-color: ${COLORS.primary}; }
        
        .property-image-wrapper-compact { position: relative; height: 180px; overflow: hidden; background: ${COLORS.gray}; }
        .property-image-compact { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .property-card-compact:hover .property-image-compact { transform: scale(1.08); }
        
        .verified-badge-compact { position: absolute; top: 12px; left: 12px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3); animation: badgeSlideIn 0.4s ease; }
        
        .favorite-btn-compact { position: absolute; top: 12px; right: 12px; width: 40px; height: 40px; background: rgba(60, 60, 60, 0.75); border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(8px); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3); z-index: 10; }
        .favorite-btn-compact:hover { transform: scale(1.1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); background: rgba(80, 80, 80, 0.85); }
        .favorite-btn-compact.animate { animation: heartPulse 0.6s ease; }
        
        .favorite-icon { color: #fff; transition: all 0.3s ease; }
        .favorite-icon.active { color: #ff4444; }
        
        .property-card-body-compact { padding: 14px; display: flex; flex-direction: column; flex: 1; }
        
        .rating-stars-compact { display: flex; gap: 3px; margin-bottom: 8px; align-items: center; }
        
        .star-rating { color: #FFC107; font-size: 12px; }
        .star-rating.empty { color: #ddd; }
        
        .rating-text { margin-left: 8px; font-size: 12px; font-weight: bold; color: #666; }
        .no-rating-text { font-size: 12px; color: #999; }
        
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
        .btn-icon-compact { width: 34px; height: 34px; background: #fff; border: 2px solid ${COLORS.primary}; border-radius: 8px; color: ${COLORS.primary}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .btn-icon-compact:hover { background: ${COLORS.primary}; color: #fff; transform: translateY(-1px); }
        .btn-report-compact { border-color: #dc3545; color: #dc3545; }
        .btn-report-compact:hover { background: #dc3545; color: #fff; }
      `}</style>
      
      <Link to={`/property/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="property-card-compact">
          <div className="property-image-wrapper-compact">
            <img src={mainImage} className="property-image-compact" alt={item.title} onError={(e) => (e.target.style.display = "none")} />
            {item.isVerified && (
              <div className="verified-badge-compact">
                <FaCheckCircle size={16} />
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
                  <FaBed /> <span>{item.bedrooms}</span>
                </div>
              )}
              {item.bathrooms > 0 && (
                <div className="property-feature-item-compact">
                  <FaBath /> <span>{item.bathrooms}</span>
                </div>
              )}
              {item.floors > 0 && (
                <div className="property-feature-item-compact">
                  <FaLayerGroup /> <span>{item.floors}</span>
                </div>
              )}
              {item.area && item.area.sqft && (
                <div className="property-feature-item-compact">
                  <FaRulerCombined /> <span>{item.area.sqft}</span>
                </div>
              )}
            </div>

            {showActions && (
              <div className="property-actions-compact">
                <Link to={`/property/${item._id}`} className="btn-details-compact" onClick={(e) => e.stopPropagation()}>View Details</Link>
                {onContact && (
                  <button className="btn-icon-compact" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onContact(item._id); }} title="Contact">
                    <FaPhone size={12} />
                  </button>
                )}
                {onReport && (
                  <button className="btn-icon-compact btn-report-compact" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onReport(item._id); }} title="Report">
                    ⚠️
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

export default PropertyCardCompact;
