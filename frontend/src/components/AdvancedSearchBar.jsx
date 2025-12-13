import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const nepalCities = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bhaktapur",
  "Biratnagar",
  "Janakpur",
  "Birtamod",
  "Itahari",
  "Dharan",
  "Nepalgunj",
  "Dhulikhel",
  "Gorkha",
  "Chitwan",
];

const propertyTypes = ["House", "Land", "Apartment", "Building"];

const COLORS = {
  primary: "#2B5BBA",
  dark: "#1E3A5F",
  gray: "#F5F5F5",
  text: "#333333",
  border: "#E0E0E0",
};

export default function AdvancedSearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    priceMin: "",
    priceMax: "",
    search: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  };

  return (
    <div
      className="card p-3 mb-4 shadow-sm border-0"
      style={{ background: COLORS.gray, borderRadius: 12, border: `1px solid ${COLORS.border}` }}
    >
      <div className="d-flex align-items-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle me-2"
          style={{ width: 34, height: 34, background: COLORS.primary, color: "#fff" }}
        >
          <FaSearch />
        </div>
        <h5 className="mb-0" style={{ color: COLORS.dark }}>Search Properties</h5>
      </div>
      <form onSubmit={handleSearch}>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="search" className="form-label fw-semibold" style={{ color: COLORS.text }}>Keywords</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Enter keywords"
              className="form-control"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="propertyType" className="form-label fw-semibold" style={{ color: COLORS.text }}>Property Type</label>
            <select
              id="propertyType"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="form-select"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="location" className="form-label fw-semibold" style={{ color: COLORS.text }}>Location</label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="form-select"
              style={{ borderColor: COLORS.border }}
            >
              <option value="">All Locations</option>
              {nepalCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label htmlFor="priceMin" className="form-label fw-semibold" style={{ color: COLORS.text }}>Min Price</label>
            <input
              type="number"
              id="priceMin"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleChange}
              placeholder="Min"
              className="form-control"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="priceMax" className="form-label fw-semibold" style={{ color: COLORS.text }}>Max Price</label>
            <input
              type="number"
              id="priceMax"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleChange}
              placeholder="Max"
              className="form-control"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div className="col-md-1 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ background: COLORS.primary, borderColor: COLORS.primary, borderRadius: 8 }}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}