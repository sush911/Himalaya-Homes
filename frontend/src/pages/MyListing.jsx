import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProperties, getMyRequests } from "../api/property";
import { Button } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const PropertyCard = ({ property }) => {
  const { t } = useLanguage();
  const firstPhoto = property.media?.propertyPhotos?.[0];
  const mainImage = (typeof firstPhoto === 'object' ? firstPhoto.original : firstPhoto) || "https://via.placeholder.com/400x300";

  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <img
          src={mainImage}
          className="card-img-top"
          alt={property.title}
          style={{ height: "250px", objectFit: "cover" }}
          onError={(e) => (e.target.src = "https://via.placeholder.com/400x300")}
        />
        <span className="badge bg-primary position-absolute top-0 start-0 m-2">
          For {property.listingType === "sale" ? "Sale" : "Rent"}
        </span>
        <span className="badge bg-dark position-absolute top-0 end-0 m-2">
          {property.propertyType}
        </span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{property.title}</h5>
        <p className="text-muted mb-2">
          <FaMapMarkerAlt /> {property.location?.address}, {property.location?.city}
        </p>
        <p className="fw-bold mb-2 text-primary">Rs {property.price?.toLocaleString()}</p>
        
        <div className="mb-2">
          <small className="text-muted">
            {property.bedrooms > 0 && (
              <span className="me-2">
                <FaBed /> {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="me-2">
                <FaBath /> {property.bathrooms} Baths
              </span>
            )}
            {property.floors > 0 && (
              <span className="me-2">{property.floors} Floors</span>
            )}
          </small>
        </div>

        {property.area && (
          <div className="mb-2">
            <small className="text-muted">
              <FaRulerCombined />{" "}
              {property.area.sqft && `${property.area.sqft} sqft`}
              {property.area.ana && `, ${property.area.ana} Ana`}
              {property.area.ropani && `, ${property.area.ropani} Ropani`}
            </small>
          </div>
        )}

        {property.constructionYear && (
          <small className="text-muted d-block mb-2">Built: {property.constructionYear}</small>
        )}

        {property.description && (
          <p className="card-text small text-muted mb-2" style={{ 
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {property.description}
          </p>
        )}

        <div className="mt-auto">
          <Link to={`/property/${property._id}`} className="btn btn-primary btn-sm w-100">
            View Details
          </Link>
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

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [propsRes, reqRes] = await Promise.all([
          getMyProperties(token),
          getMyRequests(token),
        ]);
        setProperties(propsRes.data);
        setRequests(reqRes.data);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (!token) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Please login to view your listings.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Listings</h2>
      
      <h5 className="mb-3">Approved & Live Properties</h5>
      {properties.length === 0 ? (
        <div className="alert alert-info">
          <p>No approved listings yet. Your submitted properties will appear here after admin approval.</p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {properties.map((p) => (
            <div className="col-md-4 col-lg-4" key={p._id}>
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      )}

      <h5 className="mb-3">Pending Requests</h5>
      {requests.length === 0 ? (
        <div className="alert alert-info">
          <p>No pending requests. Submit a property from the Sell page to see it here.</p>
        </div>
      ) : (
        <div className="row g-3">
          {requests.map((r) => (
            <div className="col-md-4" key={r._id}>
              <div className="card p-3">
                <h6>{r.title}</h6>
                <p className="mb-1 text-muted">{r.location?.city}</p>
                <p className="fw-bold text-primary mb-2">Rs {r.price?.toLocaleString()}</p>
                <span className={`badge ${r.status === "approved" ? "bg-success" : r.status === "rejected" ? "bg-danger" : "bg-warning"}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListing;
