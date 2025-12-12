import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getPropertyById, getContactInfo, toggleFavorite, reportProperty } from "../api/property";
import { Modal, Button, Carousel } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaStar } from "react-icons/fa";

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

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data);
        
        // Collect all images for gallery
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

  const openGallery = (startIndex = 0) => {
    setGalleryStartIndex(startIndex);
    setShowGallery(true);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Property not found</div>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const mainImage = property.media?.propertyPhotos?.[0] || "https://via.placeholder.com/800x600";
  const coordinates = property.location?.coordinates;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
          ← Back
        </Button>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <span className="badge bg-primary mb-2">
              For {property.listingType === "sale" ? "Sale" : "Rent"}
            </span>
            <h1 className="mb-2">{property.title}</h1>
            <p className="text-muted mb-2">
              <FaMapMarkerAlt /> {property.location?.address}, {property.location?.city}, {property.location?.country}
            </p>
            <h3 className="text-primary mb-3">Rs {property.price?.toLocaleString()}</h3>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={handleFavorite}>
              <FaHeart /> Favorite
            </Button>
            <Button variant="outline-warning" onClick={handleReport}>
              Report
            </Button>
            <Button variant="primary" onClick={handleContact}>
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Main Image */}
          <div className="mb-4">
            <img
              src={mainImage}
              alt={property.title}
              className="img-fluid rounded"
              style={{ width: "100%", maxHeight: "500px", objectFit: "cover", cursor: "pointer" }}
              onClick={() => openGallery(0)}
            />
            {galleryImages.length > 1 && (
              <Button variant="outline-primary" className="mt-2" onClick={() => openGallery(0)}>
                View All {galleryImages.length} Photos
              </Button>
            )}
          </div>

          {/* Property Details */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Property Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Property Type:</strong> {property.propertyType}</p>
                  {property.bedrooms > 0 && (
                    <p>
                      <FaBed /> <strong>Bedrooms:</strong> {property.bedrooms}
                    </p>
                  )}
                  {property.bathrooms > 0 && (
                    <p>
                      <FaBath /> <strong>Bathrooms:</strong> {property.bathrooms}
                    </p>
                  )}
                  {property.floors > 0 && (
                    <p><strong>Floors:</strong> {property.floors}</p>
                  )}
                </div>
                <div className="col-md-6">
                  {property.constructionYear && (
                    <p><strong>Construction Year:</strong> {property.constructionYear}</p>
                  )}
                  {property.area && (
                    <p>
                      <FaRulerCombined /> <strong>Area:</strong>{" "}
                      {property.area.sqft && `${property.area.sqft} sqft`}
                      {property.area.ana && `, ${property.area.ana} Ana`}
                      {property.area.ropani && `, ${property.area.ropani} Ropani`}
                    </p>
                  )}
                  {property.amenities && property.amenities.length > 0 && (
                    <p>
                      <strong>Amenities:</strong> {property.amenities.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Description</h5>
              </div>
              <div className="card-body">
                <p style={{ whiteSpace: "pre-wrap" }}>{property.description}</p>
              </div>
            </div>
          )}

          {/* Media Sections */}
          {property.media && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Photos & Videos</h5>
              </div>
              <div className="card-body">
                {/* Property Photos */}
                {property.media.propertyPhotos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Property Photos ({property.media.propertyPhotos.length})</h6>
                    <div className="row g-2">
                      {property.media.propertyPhotos.slice(0, 6).map((url, idx) => (
                        <div key={idx} className="col-md-4">
                          <img
                            src={url}
                            alt={`Property ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ height: "200px", objectFit: "cover", width: "100%", cursor: "pointer" }}
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

                {/* Property Videos */}
                {property.media.propertyVideos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Property Videos ({property.media.propertyVideos.length})</h6>
                    <div className="row g-2">
                      {property.media.propertyVideos.map((url, idx) => (
                        <div key={idx} className="col-md-6">
                          <video controls className="w-100 rounded" style={{ maxHeight: "400px" }}>
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lalpurja Photos */}
                {property.media.lalpurjaPhotos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Lalpurja Photos ({property.media.lalpurjaPhotos.length})</h6>
                    <div className="row g-2">
                      {property.media.lalpurjaPhotos.map((url, idx) => (
                        <div key={idx} className="col-md-3">
                          <img
                            src={url}
                            alt={`Lalpurja ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ height: "150px", objectFit: "cover", width: "100%", cursor: "pointer" }}
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

                {/* Road Photos */}
                {property.media.roadPhotos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Road Photos ({property.media.roadPhotos.length})</h6>
                    <div className="row g-2">
                      {property.media.roadPhotos.map((url, idx) => (
                        <div key={idx} className="col-md-3">
                          <img
                            src={url}
                            alt={`Road ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ height: "150px", objectFit: "cover", width: "100%", cursor: "pointer" }}
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

                {/* Road Videos */}
                {property.media.roadVideos?.length > 0 && (
                  <div className="mb-4">
                    <h6>Road Videos ({property.media.roadVideos.length})</h6>
                    <div className="row g-2">
                      {property.media.roadVideos.map((url, idx) => (
                        <div key={idx} className="col-md-6">
                          <video controls className="w-100 rounded" style={{ maxHeight: "400px" }}>
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

          {/* Nearby Places */}
          {property.nearby && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">What's Nearby</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {property.nearby.education?.length > 0 && (
                    <div className="col-md-4 mb-3">
                      <h6>Education</h6>
                      <ul className="list-unstyled">
                        {property.nearby.education.slice(0, 3).map((place, idx) => (
                          <li key={idx} className="small">
                            {place.name} {place.distanceKm > 0 && `(${place.distanceKm} km)`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {property.nearby.food?.length > 0 && (
                    <div className="col-md-4 mb-3">
                      <h6>Food</h6>
                      <ul className="list-unstyled">
                        {property.nearby.food.slice(0, 3).map((place, idx) => (
                          <li key={idx} className="small">
                            {place.name} {place.distanceKm > 0 && `(${place.distanceKm} km)`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {property.nearby.health?.length > 0 && (
                    <div className="col-md-4 mb-3">
                      <h6>Health & Medicine</h6>
                      <ul className="list-unstyled">
                        {property.nearby.health.slice(0, 3).map((place, idx) => (
                          <li key={idx} className="small">
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

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Map */}
          {coordinates && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Location</h5>
              </div>
              <div className="card-body p-0">
                <div style={{ height: "400px" }}>
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
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

          {/* Contact Card */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Contact Owner</h5>
            </div>
            <div className="card-body text-center">
              {token ? (
                <Button variant="primary" size="lg" className="w-100" onClick={handleContact}>
                  Contact Us
                </Button>
              ) : (
                <>
                  <Button variant="primary" size="lg" className="w-100" disabled>
                    Contact Us
                  </Button>
                  <p className="mt-2 small text-warning">
                    Please <Link to="/login">login</Link> to view contact information
                  </p>
                </>
              )}
              {property.postedBy && (
                <p className="mt-3 small text-muted">
                  Posted by: {property.postedBy.firstName} {property.postedBy.lastName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <Modal show={showGallery} onHide={() => setShowGallery(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Photo Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel activeIndex={galleryStartIndex} onSelect={(idx) => setGalleryStartIndex(idx)}>
            {galleryImages.map((img, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100"
                  src={img.url}
                  alt={`Gallery ${idx + 1}`}
                  style={{ maxHeight: "70vh", objectFit: "contain" }}
                />
                <Carousel.Caption>
                  <small>{img.type}</small>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>

      {/* Contact Modal */}
      <Modal show={showContact} onHide={() => setShowContact(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Owner Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {contactInfo ? (
            <div>
              <p><strong>Name:</strong> {contactInfo.name}</p>
              <p><strong>Email:</strong> {contactInfo.email}</p>
              <p><strong>Phone:</strong> {contactInfo.phone}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PropertyDetail;

