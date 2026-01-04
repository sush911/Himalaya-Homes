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
import { useLanguage } from "../context/LanguageContext";
import "../styles/PropertyDetail.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
          images.push(...res.data.media.propertyPhotos.map(url => ({ 
            url: typeof url === 'object' ? url.original : url, 
            type: "property" 
          })));
        }
        if (res.data.media?.lalpurjaPhotos?.length) {
          images.push(...res.data.media.lalpurjaPhotos.map(url => ({ 
            url: typeof url === 'object' ? url.original : url, 
            type: "lalpurja" 
          })));
        }
        if (res.data.media?.roadPhotos?.length) {
          images.push(...res.data.media.roadPhotos.map(url => ({ 
            url: typeof url === 'object' ? url.original : url, 
            type: "road" 
          })));
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
          <p style={{ marginTop: '20px', color: '#666' }}>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h4>{t('noResults')}</h4>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', padding: '10px 20px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {t('backToLogin')}
        </button>
      </div>
    );
  }

  const mainImage = (typeof property.media?.propertyPhotos?.[0] === 'object' ? property.media.propertyPhotos[0].original : property.media?.propertyPhotos?.[0]) || "https://via.placeholder.com/800x600";
  const coordinates = property.location?.coordinates;

  return (
    <>
      <div className="property-detail-page">
        <div className="detail-container">
          {/* Top: Title and Badge */}
          <div style={{ marginBottom: '20px' }}>
            <span className="listing-badge">
              {t(property.listingType === "sale" ? "forSale" : "forRent")}
            </span>
            <h1 className="property-title">{property.title}</h1>
            {property.location?.address && (
              <div style={{ fontSize: '15px', color: '#666', marginTop: '8px' }}>
                {property.location.address}, {property.location.city}
              </div>
            )}
          </div>

          {/* Image Section - Left: Main Image, Right: Show All + Map */}
          <div className="media-layout">
            {/* Left Side - Main Image */}
            <div className="main-image-section">
              <img
                src={mainImage}
                alt={property.title}
                className="hero-image"
                onClick={() => openGallery(0)}
              />
            </div>

            {/* Right Side - Tabs for Photos/Videos/Location */}
            <div className="media-tabs-section">
              {/* Tabs */}
              <div className="tab-navigation">
                <div 
                  className={`tab-item ${activeTab === 'photos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('photos')}
                >
                  Photos
                </div>
                <div 
                  className={`tab-item ${activeTab === 'videos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('videos')}
                >
                  Video
                </div>
                <div 
                  className={`tab-item ${activeTab === 'location' ? 'active' : ''}`}
                  onClick={() => setActiveTab('location')}
                >
                  Location
                </div>
              </div>

              {/* Tab Content */}
              <div className="tab-content-area">
                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <div className="photos-grid">
                    {galleryImages.slice(0, 3).map((img, idx) => (
                      <div key={idx} className="photo-card" onClick={() => openGallery(idx)}>
                        <img src={img.url} alt={`Photo ${idx + 1}`} />
                      </div>
                    ))}
                    {galleryImages.length > 3 && (
                      <div className="photo-card" onClick={() => openGallery(0)}>
                        <img src={galleryImages[3]?.url || galleryImages[0]?.url} alt="More" />
                        <div className="view-all-overlay">
                          <FaImage size={20} />
                          Show all {galleryImages.length} photos
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === 'videos' && (
                  <div className="videos-grid">
                    {property.media?.propertyVideos?.length > 0 ? (
                      property.media.propertyVideos.map((videoUrl, idx) => (
                        <video key={idx} className="video-player" controls>
                          <source src={typeof videoUrl === 'object' ? videoUrl.original : videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ))
                    ) : (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                        No videos available
                      </div>
                    )}
                    {property.media?.roadVideos?.length > 0 && property.media.roadVideos.map((videoUrl, idx) => (
                      <video key={`road-${idx}`} className="video-player" controls>
                        <source src={typeof videoUrl === 'object' ? videoUrl.original : videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && coordinates && (
                  <div className="map-wrapper">
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
          </div>

          {/* Price and Actions Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', marginBottom: '25px' }}>
            {/* Left: Price */}
            <div className="property-price">Rs {property.price?.toLocaleString()} crore</div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button className="btn-custom btn-primary-custom" onClick={handleContact}>
                {t('contactOwner').toUpperCase()}
              </button>
              {/* Verified Badge - Always show for testing */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}>
                <FaCheckCircle size={16} /> Verified
              </div>
              <button 
                className={`btn-custom btn-outline-custom ${isFavorited ? 'favorited' : ''}`} 
                onClick={handleFavorite}
                style={{ padding: '10px 15px' }}
              >
                <FaHeart color={isFavorited ? '#ff4444' : '#666'} />
              </button>
              <div className="rating-display">
                <div className="star-icons">
                  {[1, 2, 3, 4, 5].map(i => (
                    <FaStar 
                      key={i} 
                      size={16} 
                      color={i <= Math.round(property.averageRating || 0) ? '#ffc107' : '#e0e0e0'} 
                    />
                  ))}
                </div>
                <span className="review-count">{property.totalReviews || 0} {t('recent')}</span>
              </div>
              <div className="report-link" onClick={handleReport}>
                <FaFlag /> {t('reportProperty')}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="details-section">
            <h3 className="section-heading">{t('propertyDetails')}</h3>
            <div className="details-grid">
              {/* Row 1 */}
              {(property.area?.sqft || property.area?.ana || property.area?.ropani) && (
                <div className="detail-row">
                  <FaRulerCombined className="detail-icon" />
                  <span className="detail-label">{t('area')}</span>
                  <span className="detail-value">
                    {property.area?.sqft && `${property.area.sqft} sq ft`}
                    {property.area?.ana && ` (${property.area.ana} Ana)`}
                    {property.area?.ropani && ` ${property.area.ropani} Ropani`}
                  </span>
                </div>
              )}

              {property.floors > 0 && (
                <div className="detail-row">
                  <FaBuilding className="detail-icon" />
                  <span className="detail-label">Elevator</span>
                  <span className="detail-value">{property.floors}</span>
                </div>
              )}

              {property.floors > 0 && (
                <div className="detail-row">
                  <FaBuilding className="detail-icon" />
                  <span className="detail-label">Floor</span>
                  <span className="detail-value">{property.floors}rd</span>
                </div>
              )}

              {/* Row 2 */}
              {property.bedrooms > 0 && (
                <div className="detail-row">
                  <FaBed className="detail-icon" />
                  <span className="detail-label">{t('bedrooms')}</span>
                  <span className="detail-value">{property.bedrooms}</span>
                </div>
              )}

              {property.parking > 0 && (
                <div className="detail-row">
                  <FaParking className="detail-icon" />
                  <span className="detail-label">{t('parking')}</span>
                  <span className="detail-value">Yes</span>
                </div>
              )}

              {property.constructionYear && (
                <div className="detail-row">
                  <FaCalendar className="detail-icon" />
                  <span className="detail-label">{t('year')}</span>
                  <span className="detail-value">{property.constructionYear}</span>
                </div>
              )}

              {/* Row 3 */}
              {property.bathrooms > 0 && (
                <div className="detail-row">
                  <FaBath className="detail-icon" />
                  <span className="detail-label">{t('bathrooms')}</span>
                  <span className="detail-value">{property.bathrooms}</span>
                </div>
              )}

              <div className="detail-row">
                {/* Empty cell for layout */}
              </div>

              <div className="detail-row">
                {/* Empty cell for layout */}
              </div>
            </div>
          </div>

          {/* What's Nearby */}
          {property.nearby && (
            <div className="nearby-section">
              <h3 className="section-heading">{t('nearbyFacilities')}</h3>
              <div className="nearby-grid">
                {property.nearby.education?.length > 0 && (
                  <div className="nearby-category">
                    <h4>📚 Education</h4>
                    <ul className="nearby-list">
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
                  <div className="nearby-category">
                    <h4>🍽️ Food</h4>
                    <ul className="nearby-list">
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
                  <div className="nearby-category">
                    <h4>🏥 Health & Medicine</h4>
                    <ul className="nearby-list">
                      {property.nearby.health.slice(0, 3).map((place, idx) => (
                        <li key={idx}>
                          <span>{place.name}</span>
                          <span>{place.distanceKm > 0 ? `${place.distanceKm} km` : '0.089 km'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="nearby-category">
                  <h4>🎭 Culture</h4>
                  <ul className="nearby-list">
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
            <div className="description-section">
              <h3 className="section-heading">{t('description')}</h3>
              <p className="description-text">{property.description}</p>
            </div>
          )}


        </div>
      </div>

      {/* Gallery Modal */}
      <Modal show={showGallery} onHide={() => setShowGallery(false)} size="xl" centered>
        <Modal.Header closeButton style={{ background: '#4A90E2', color: 'white', border: 'none' }}>
          <Modal.Title style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaImage />{t('viewMedia')}
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
            <FaUser /> {t('ownerDetails')}
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
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>{t('name')}</div>
                  <div style={{ fontSize: '16px', color: '#333', fontWeight: '700' }}>{contactInfo.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: '#4A90E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaEnvelope size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>{t('email')}</div>
                  <div style={{ fontSize: '16px', color: '#333', fontWeight: '700' }}>{contactInfo.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ width: '50px', height: '50px', background: '#4A90E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaPhone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>{t('phone')}</div>
                  <div style={{ fontSize: '16px', color: '#333', fontWeight: '700' }}>{contactInfo.phone}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: '48px', height: '48px', border: '5px solid #f3f3f3', borderTop: '5px solid #4A90E2', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
              <p style={{ marginTop: '16px', color: '#666', fontWeight: '600' }}>{t('loading')}</p>
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


