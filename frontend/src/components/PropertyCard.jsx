import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
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