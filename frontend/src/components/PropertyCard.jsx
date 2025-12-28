import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaStar, FaCheckCircle, FaHeart, FaBuilding } from 'react-icons/fa';

const PropertyCard = ({ property, onFavorite }) => {
  const firstPhoto = property.media?.propertyPhotos?.[0];
  const mainImage = (typeof firstPhoto === 'object' ? firstPhoto.original : firstPhoto) || "/placeholder-property.jpg";
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setIsFavorite(!isFavorite);
    setTimeout(() => setIsAnimating(false), 600);
    if (onFavorite) onFavorite(property._id);
  };

  return (
    <Link to={`/property/${property._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}>
        <div style={{ position: 'relative', width: '100%', paddingTop: '66.67%', overflow: 'hidden' }}>
          <img 
            src={mainImage} 
            alt={property.title} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => e.target.src = '/placeholder-property.jpg'}
          />
          {property.isVerified && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(40, 167, 69, 0.95)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(4px)'
            }}>
              <FaCheckCircle size={14} />
              Verified
            </div>
          )}
          <button 
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(60, 60, 60, 0.75)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)'
            }}
            onClick={handleFavoriteClick}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(80, 80, 80, 0.85)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(60, 60, 60, 0.75)'}
          >
            <FaHeart size={16} color={isFavorite ? '#dc3545' : '#FFFFFF'} />
          </button>
        </div>
        
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            {property.averageRating ? (
              <>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} size={12} color={star <= Math.round(property.averageRating) ? '#FFC107' : '#ddd'} />
                ))}
                <span style={{ marginLeft: '4px', fontSize: '12px', fontWeight: '600', color: '#666' }}>
                  {property.averageRating.toFixed(1)} ({property.totalReviews})
                </span>
              </>
            ) : (
              <span style={{ fontSize: '12px', color: '#999' }}>No ratings</span>
            )}
          </div>

          <div style={{ fontSize: '20px', fontWeight: '700', color: '#2B5BBA', marginBottom: '8px' }}>
            Rs {property.price?.toLocaleString()}
          </div>

          <h5 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px', lineHeight: '1.4' }}>
            {property.title}
          </h5>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666', marginBottom: '12px' }}>
            <FaMapMarkerAlt size={12} />
            <span>{property.location?.address}, {property.location?.city}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
            {property.bedrooms > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666' }}>
                <FaBed size={14} /> {property.bedrooms}
              </div>
            )}
            {property.bathrooms > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666' }}>
                <FaBath size={14} /> {property.bathrooms}
              </div>
            )}
            {property.floors > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666' }}>
                <FaBuilding size={14} /> {property.floors}
              </div>
            )}
            {property.area && property.area.sqft && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#666' }}>
                <FaRulerCombined size={14} /> {property.area.sqft}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;