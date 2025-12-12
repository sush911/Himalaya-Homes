import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { submitPropertyRequest, uploadFiles, fetchNearby } from "../api/property";

const propertyTypes = ["house", "building", "apartment", "land"];
const listingTypes = [
  { value: "sale", label: "Post for Sell (goes to Buy page after approval)" },
  { value: "rent", label: "Post for Rent" },
];

// File size limits (in bytes)
const MAX_PHOTO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB (500 MB)

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
    
    // Validate file count
    if (maxCount && files.length > maxCount) {
      alert(`Maximum ${maxCount} file(s) allowed for ${label}`);
      e.target.value = "";
      return;
    }

    // Validate file sizes
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
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {maxCount && `(max ${maxCount})`}
      </label>
      <input
        className="form-control"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
      <small className="text-muted d-block mt-1">
        Max file size: <strong>{fileSizeLimitDisplay}</strong> per file
        {helper && ` · ${helper}`}
      </small>
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
      // Upload all files to Cloudinary first
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
                throw err; // Re-throw to stop the process
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
    <div className="container py-4">
      <h2 className="mb-3">Sell / Rent your property</h2>
      <p className="text-muted">Fill details, drop a map pin for Kathmandu area, upload Lalpurja and property media. Admin will approve before it goes live.</p>

      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-lg-7">
          <div className="card p-3">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Title</label>
                <input name="title" value={form.title} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Price</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Property Type</label>
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className="form-select">
                  {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Post for</label>
                <select name="listingType" value={form.listingType} onChange={handleChange} className="form-select">
                  {listingTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Bedrooms</label>
                <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Bathrooms</label>
                <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Floors</label>
                <input name="floors" type="number" value={form.floors} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Construction Year</label>
                <input name="constructionYear" type="number" value={form.constructionYear} onChange={handleChange} className="form-control" placeholder="e.g. 2020" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Area (sq.ft)</label>
                <input name="areaSqft" type="number" value={form.areaSqft} onChange={handleChange} className="form-control" placeholder="Square feet" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Area (Ana)</label>
                <input name="areaAna" type="number" value={form.areaAna} onChange={handleChange} className="form-control" placeholder="Ana" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Area (Ropani)</label>
                <input name="areaRopani" type="number" value={form.areaRopani} onChange={handleChange} className="form-control" placeholder="Ropani" />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea name="description" rows="3" value={form.description} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="form-control" required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Province</label>
                <input name="province" value={form.province} onChange={handleChange} className="form-control" />
              </div>
            </div>
          </div>

          <div className="card p-3 mt-3">
            <h5>Uploads</h5>
            <p className="text-muted small mb-3">
              <strong>File Size Limits:</strong> Photos up to 50 MB each, Videos up to 500 MB each
            </p>
            <FileInput 
              label="Lalpurja Photos" 
              name="lalpurjaPhotos" 
              accept="image/*" 
              onChange={handleFiles} 
              helper="Upload clear Lalpurja scans" 
              maxCount={4}
            />
            <FileInput 
              label="Property Photos" 
              name="propertyPhotos" 
              accept="image/*" 
              onChange={handleFiles}
              maxCount={20}
            />
            <FileInput 
              label="Property Videos" 
              name="propertyVideos" 
              accept="video/*" 
              onChange={handleFiles}
              maxCount={2}
            />
            <FileInput 
              label="Property Road Photos" 
              name="roadPhotos" 
              accept="image/*" 
              onChange={handleFiles}
              maxCount={6}
            />
            <FileInput 
              label="Property Road Videos" 
              name="roadVideos" 
              accept="video/*" 
              onChange={handleFiles}
              maxCount={2}
            />
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Drop a pin (Kathmandu map)</h5>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={fetchNearbyPlaces}>Fetch nearby places</button>
            </div>
            <div style={{ height: 320 }} className="mt-3">
              <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OSM</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker value={coords} onChange={setCoords} />
              </MapContainer>
            </div>
            {coords && <small className="text-muted">Selected: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</small>}
          </div>

          <div className="card p-3">
            <h5>Nearby (auto-fill top 3 each)</h5>
            <div className="mb-2">
              <strong>Education</strong>
              <ul className="mb-1">
                {nearby.education.map((n, idx) => <li key={idx}>{n.name} ({n.type || "edu"})</li>)}
              </ul>
            </div>
            <div className="mb-2">
              <strong>Food</strong>
              <ul className="mb-1">
                {nearby.food.map((n, idx) => <li key={idx}>{n.name} ({n.type || "food"})</li>)}
              </ul>
            </div>
            <div className="mb-2">
              <strong>Health</strong>
              <ul className="mb-1">
                {nearby.health.map((n, idx) => <li key={idx}>{n.name} ({n.type || "health"})</li>)}
              </ul>
            </div>
          </div>

          <button className="btn btn-primary w-100 mt-3" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit for approval"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;

