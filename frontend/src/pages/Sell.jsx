import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { submitPropertyRequest, uploadFiles, fetchNearby } from "../api/property";
import { useLanguage } from "../context/LanguageContext";

const propertyTypes = ["house", "building", "apartment", "land"];
const listingTypes = [
  { value: "sale", label: "Post for Sell (goes to Buy page after approval)" },
  { value: "rent", label: "Post for Rent" },
];

// File size limits (in bytes)
const MAX_PHOTO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB

const formatFileSize = (bytes) => {
  if (bytes >= 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  } else if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  }
  return bytes + " bytes";
};

const FileInput = ({ label, name, accept, multiple = true, onChange, helper, maxSize, maxCount }) => {
  const isVideo = accept.includes("video");
  const fileSizeLimit = isVideo ? MAX_VIDEO_SIZE : MAX_PHOTO_SIZE;
  const fileSizeLimitDisplay = isVideo ? "500 MB" : "50 MB";

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (maxCount && files.length > maxCount) {
      alert(`Maximum ${maxCount} file(s) allowed for ${label}`);
      e.target.value = "";
      return;
    }

    const oversizedFiles = files.filter(file => file.size > fileSizeLimit);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => `${f.name} (${formatFileSize(f.size)})`).join(", ");
      alert(`The following files exceed the ${fileSizeLimitDisplay} limit:\n${fileNames}\n\nPlease compress or resize them before uploading.`);
      e.target.value = "";
      return;
    }

    onChange(name, files);
  };

  return (
    <div className="upload-box">
      <div className="upload-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="upload-icon">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div className="upload-label">{label} {maxCount && `(${maxCount} max)`}</div>
      <div className="upload-helper">Click or drag file to this area to upload</div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="upload-input"
      />
    </div>
  );
};

function LocationPicker({ value, onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return value ? <Marker position={[value.lat, value.lng]} /> : null;
}

const Sell = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: propertyTypes[0],
    listingType: "sale",
    bedrooms: 0,
    bathrooms: 0,
    floors: 0,
    parking: 0,
    constructionYear: "",
    areaSqft: "",
    areaAna: "",
    areaRopani: "",
    address: "",
    city: "",
    province: "",
  });
  const [coords, setCoords] = useState(null);
  const [nearby, setNearby] = useState({ education: [], food: [], health: [] });
  const [mediaFiles, setMediaFiles] = useState({
    lalpurjaPhotos: [],
    propertyPhotos: [],
    propertyVideos: [],
    roadPhotos: [],
    roadVideos: [],
  });
  const [mediaUrls, setMediaUrls] = useState({
    lalpurjaPhotos: [],
    propertyPhotos: [],
    propertyVideos: [],
    roadPhotos: [],
    roadVideos: [],
  });

  const center = useMemo(() => ({ lat: 27.7172, lng: 85.3240 }), []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFiles = (field, files) => {
    const fileArray = Array.from(files || []);
    setMediaFiles((p) => ({ ...p, [field]: fileArray }));
  };

  const fetchNearbyPlaces = async () => {
    if (!coords) return alert("Drop a pin on the map first.");
    try {
      const res = await fetchNearby(coords.lat, coords.lng);
      setNearby(res.data);
    } catch (err) {
      console.error(err);
      alert("Could not fetch nearby places. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first.");
    if (!coords) return alert("Please drop a pin on the map.");
    setLoading(true);
    setMessage("");
    try {
      const uploadPromises = [];
      const folders = {
        lalpurjaPhotos: "lalpurja",
        propertyPhotos: "property-photos",
        propertyVideos: "property-videos",
        roadPhotos: "road-photos",
        roadVideos: "road-videos",
      };

      for (const [field, files] of Object.entries(mediaFiles)) {
        if (files.length > 0) {
          uploadPromises.push(
            uploadFiles(files, folders[field] || "properties", token)
              .then((res) => ({
                field,
                urls: res.data.urls,
              }))
              .catch((err) => {
                console.error(`Upload failed for ${field}:`, err);
                alert(`Failed to upload ${field}: ${err?.response?.data?.message || err.message}`);
                throw err;
              })
          );
        }
      }

      if (uploadPromises.length === 0) {
        alert("Please upload at least one file (Lalpurja photo, property photo, or property video)");
        setLoading(false);
        return;
      }

      const uploadResults = await Promise.all(uploadPromises);
      const uploadedMedia = { lalpurjaPhotos: [], propertyPhotos: [], propertyVideos: [], roadPhotos: [], roadVideos: [] };
      uploadResults.forEach(({ field, urls }) => {
        uploadedMedia[field] = urls;
      });

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        propertyType: form.propertyType,
        listingType: form.listingType,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        floors: Number(form.floors) || 0,
        parking: Number(form.parking) || 0,
        constructionYear: form.constructionYear ? Number(form.constructionYear) : undefined,
        area: {
          sqft: form.areaSqft ? Number(form.areaSqft) : undefined,
          ana: form.areaAna ? Number(form.areaAna) : undefined,
          ropani: form.areaRopani ? Number(form.areaRopani) : undefined,
        },
        amenities: [],
        location: {
          address: form.address,
          city: form.city,
          province: form.province,
          country: "Nepal",
          coordinates: coords,
        },
        nearby,
        media: uploadedMedia,
      };
      await submitPropertyRequest(payload, token);
      setMessage("Submitted for approval. It also appears in your My Listing.");
      setMediaFiles({ lalpurjaPhotos: [], propertyPhotos: [], propertyVideos: [], roadPhotos: [], roadVideos: [] });
      setMediaUrls({ lalpurjaPhotos: [], propertyPhotos: [], propertyVideos: [], roadPhotos: [], roadVideos: [] });
      setForm({
        title: "",
        description: "",
        price: "",
        propertyType: propertyTypes[0],
        listingType: "sale",
        bedrooms: 0,
        bathrooms: 0,
        floors: 0,
        parking: 0,
        constructionYear: "",
        areaSqft: "",
        areaAna: "",
        areaRopani: "",
        address: "",
        city: "",
        province: "",
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Submit failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .sell-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }
        
        .sell-header {
          margin-bottom: 32px;
        }
        
        .sell-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        
        .sell-subtitle {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
        }
        
        .success-alert {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        
        .form-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 24px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        
        .form-grid-full {
          grid-column: 1 / -1;
        }
        
        .form-group-custom {
          display: flex;
          flex-direction: column;
        }
        
        .input-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        
        .input-icon {
          width: 20px;
          height: 20px;
          color: #666;
        }
        
        .form-input {
          height: 48px;
          border: 1px solid #d0d0d0;
          border-radius: 8px;
          padding: 0 16px;
          font-size: 15px;
          color: #1a1a1a;
          transition: all 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #2B5BBA;
          box-shadow: 0 0 0 3px rgba(43, 91, 186, 0.1);
        }
        
        .form-textarea {
          min-height: 120px;
          border: 1px solid #d0d0d0;
          border-radius: 8px;
          padding: 16px;
          font-size: 15px;
          color: #1a1a1a;
          resize: vertical;
          transition: all 0.2s;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #2B5BBA;
          box-shadow: 0 0 0 3px rgba(43, 91, 186, 0.1);
        }
        
        .upload-box {
          position: relative;
          border: 2px dashed #d0d0d0;
          border-radius: 8px;
          padding: 32px 24px;
          text-align: center;
          background: #fafafa;
          transition: all 0.3s;
          cursor: pointer;
          margin-bottom: 16px;
        }
        
        .upload-box:hover {
          border-color: #2B5BBA;
          background: #f0f5ff;
        }
        
        .upload-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        
        .upload-icon {
          width: 40px;
          height: 40px;
          color: #2B5BBA;
        }
        
        .upload-label {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        
        .upload-helper {
          font-size: 13px;
          color: #666;
        }
        
        .upload-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
        
        .map-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 24px;
        }
        
        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .map-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .btn-fetch {
          background: #ffffff;
          border: 1px solid #2B5BBA;
          color: #2B5BBA;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-fetch:hover {
          background: #2B5BBA;
          color: #ffffff;
        }
        
        .map-wrapper {
          height: 320px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }
        
        .coords-display {
          font-size: 13px;
          color: #666;
          margin-top: 12px;
        }
        
        .nearby-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 24px;
        }
        
        .nearby-section {
          margin-bottom: 16px;
        }
        
        .nearby-section:last-child {
          margin-bottom: 0;
        }
        
        .nearby-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        
        .nearby-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nearby-item {
          font-size: 13px;
          color: #666;
          padding: 4px 0;
          padding-left: 20px;
          position: relative;
        }
        
        .nearby-item:before {
          content: '•';
          position: absolute;
          left: 8px;
          color: #2B5BBA;
        }
        
        .btn-submit {
          width: 100%;
          height: 52px;
          background: #2B5BBA;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-submit:hover:not(:disabled) {
          background: #1E3A5F;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(43, 91, 186, 0.3);
        }
        
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .sell-container {
            padding: 24px 16px;
          }
          
          .form-section {
            padding: 24px 20px;
          }
        }
      `}</style>

      <div className="sell-container">
        <div className="sell-header">
          <h2 className="sell-title">Fill out Property details</h2>
          <p className="sell-subtitle">
            Fill details, drop a map pin for your property location, upload Lalpurja and property media. Admin will approve before it goes live.
          </p>
        </div>

        {message && <div className="success-alert">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-lg-7">
              {/* Property Details Section */}
              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Property Name
                    </label>
                    <input name="title" value={form.title} onChange={handleChange} className="form-input" required placeholder="Ram home" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Price
                    </label>
                    <input name="price" type="number" value={form.price} onChange={handleChange} className="form-input" required placeholder="50000" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
                      </svg>
                      Total Area
                    </label>
                    <input name="areaSqft" type="number" value={form.areaSqft} onChange={handleChange} className="form-input" placeholder="120sq" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Bedrooms
                    </label>
                    <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} className="form-input" placeholder="8" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Floors
                    </label>
                    <input name="floors" type="number" value={form.floors} onChange={handleChange} className="form-input" placeholder="7" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Bathrooms
                    </label>
                    <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} className="form-input" placeholder="4" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 7 15.5 7 14 7.67 14 8.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 7 8.5 7 7 7.67 7 8.5 7.67 10 8.5 10z" />
                      </svg>
                      Parking
                    </label>
                    <input name="parking" type="number" value={form.parking} onChange={handleChange} className="form-input" placeholder="2" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Construction year
                    </label>
                    <input name="constructionYear" type="number" value={form.constructionYear} onChange={handleChange} className="form-input" placeholder="2016" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">
                      <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                      </svg>
                      Total area (in ana)
                    </label>
                    <input name="areaAna" type="number" value={form.areaAna} onChange={handleChange} className="form-input" placeholder="5" />
                  </div>

                  <div className="form-group-custom form-grid-full">
                    <label className="input-label">Property Type</label>
                    <select name="propertyType" value={form.propertyType} onChange={handleChange} className="form-input">
                      {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div className="form-group-custom form-grid-full">
                    <label className="input-label">Post for</label>
                    <select name="listingType" value={form.listingType} onChange={handleChange} className="form-input">
                      {listingTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div className="form-group-custom form-grid-full">
                    <label className="input-label">Area (Ropani)</label>
                    <input name="areaRopani" type="number" value={form.areaRopani} onChange={handleChange} className="form-input" placeholder="Ropani" />
                  </div>

                  <div className="form-group-custom form-grid-full">
                    <label className="input-label">Address</label>
                    <input name="address" value={form.address} onChange={handleChange} className="form-input" required placeholder="Enter address" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">City</label>
                    <input name="city" value={form.city} onChange={handleChange} className="form-input" required placeholder="Kathmandu" />
                  </div>

                  <div className="form-group-custom">
                    <label className="input-label">Province</label>
                    <input name="province" value={form.province} onChange={handleChange} className="form-input" placeholder="Bagmati" />
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="form-section">
                <h3 className="section-title">Upload Media</h3>
                <FileInput 
                  label="Lalpurja Upload" 
                  name="lalpurjaPhotos" 
                  accept="image/*" 
                  onChange={handleFiles}
                  maxCount={4}
                />
                <FileInput 
                  label="Property Photo Upload" 
                  name="propertyPhotos" 
                  accept="image/*" 
                  onChange={handleFiles}
                  maxCount={20}
                />
                <FileInput 
                  label="Property Video Upload" 
                  name="propertyVideos" 
                  accept="video/*" 
                  onChange={handleFiles}
                  maxCount={2}
                />
                <FileInput 
                  label="Property Road Photo Upload" 
                  name="roadPhotos" 
                  accept="image/*" 
                  onChange={handleFiles}
                  maxCount={6}
                />
                <FileInput 
                  label="Property Road Video Upload" 
                  name="roadVideos" 
                  accept="video/*" 
                  onChange={handleFiles}
                  maxCount={2}
                />
              </div>

              {/* Description Section */}
              <div className="form-section">
                <h3 className="section-title">Fill out property description</h3>
                <div className="form-group-custom">
                  <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    className="form-textarea" 
                    required
                    placeholder="This beautiful home offers a warm and inviting atmosphere with plenty of natural light throughout..."
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              {/* Map Section */}
              <div className="map-container">
                <div className="map-header">
                  <h3 className="map-title">Point your location on map</h3>
                  <button type="button" className="btn-fetch" onClick={fetchNearbyPlaces}>
                    Fetch nearby
                  </button>
                </div>
                <div className="map-wrapper">
                  <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OSM</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker value={coords} onChange={setCoords} />
                  </MapContainer>
                </div>
                {coords && <div className="coords-display">Selected: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>}
              </div>

              {/* Nearby Places */}
              <div className="nearby-container">
                <h3 className="section-title">Nearby Places</h3>
                
                <div className="nearby-section">
                  <div className="nearby-title">Education</div>
                  <ul className="nearby-list">
                    {nearby.education.length > 0 ? (
                      nearby.education.map((n, idx) => <li key={idx} className="nearby-item">{n.name} ({n.type || "edu"})</li>)
                    ) : (
                      <li className="nearby-item">No data yet</li>
                    )}
                  </ul>
                </div>

                <div className="nearby-section">
                  <div className="nearby-title">Food</div>
                  <ul className="nearby-list">
                    {nearby.food.length > 0 ? (
                      nearby.food.map((n, idx) => <li key={idx} className="nearby-item">{n.name} ({n.type || "food"})</li>)
                    ) : (
                      <li className="nearby-item">No data yet</li>
                    )}
                  </ul>
                </div>

                <div className="nearby-section">
                  <div className="nearby-title">Health</div>
                  <ul className="nearby-list">
                    {nearby.health.length > 0 ? (
                      nearby.health.map((n, idx) => <li key={idx} className="nearby-item">{n.name} ({n.type || "health"})</li>)
                    ) : (
                      <li className="nearby-item">No data yet</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Upload Property Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Sell;

