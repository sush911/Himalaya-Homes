import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaStar, FaCheckCircle } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          size={12}
          color={i <= Math.round(rating) ? '#ffc107' : '#ddd'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="col-md-4 col-sm-6 mb-4">
      <Link to={`/property/${property._id}`} className="text-decoration-none">
        <div className="property-card">
          <div className="position-relative">
            <img
              src={property.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
              alt={property.title}
              onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'}
            />
            <span className="badge bg-primary position-absolute top-0 start-0 m-2">
              For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
            </span>
            <span className="badge bg-dark position-absolute top-0 end-0 m-2">
              {property.propertyType}
            </span>
            {property.isVerified && (
              <span className="badge bg-success position-absolute bottom-0 start-0 m-2">
                <FaCheckCircle className="me-1" /> Verified
              </span>
            )}
          </div>
          <div className="p-3">
            <h5 className="property-price mb-2">
              NPR {property.price.toLocaleString()}
              {property.listingType === 'rent' && '/month'}
            </h5>
            <h6 className="mb-2 text-dark">{property.title}</h6>
            <p className="property-location mb-3">
              <FaMapMarkerAlt /> {property.location.city}, {property.location.country}
            </p>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex gap-1">
                {renderStars(property.averageRating)}
              </div>
              {property.averageRating > 0 && (
                <small className="text-muted">
                  {property.averageRating.toFixed(1)} ({property.totalReviews})
                </small>
              )}
            </div>
            <div className="property-features">
              <span><FaBed /> {property.bedrooms}</span>
              <span><FaBath /> {property.bathrooms}</span>
              <span><FaRulerCombined /> {property.area.value} {property.area.unit}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;