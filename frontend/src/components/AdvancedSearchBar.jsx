import React, { useState } from "react";

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
    // Call onSearch callback immediately when filters change
    if (onSearch) {
      onSearch(newFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">Search Properties</h5>
      <form onSubmit={handleSearch}>
        <div className="row g-3">
          {/* Search Keywords */}
          <div className="col-md-3">
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Enter keywords"
              className="form-control"
            />
          </div>

          {/* Property Type */}
          <div className="col-md-2">
            <label htmlFor="propertyType" className="form-label">Property Type</label>
            <select
              id="propertyType"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="col-md-2">
            <label htmlFor="location" className="form-label">Location</label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">All Locations</option>
              {nepalCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="col-md-2">
            <label htmlFor="priceMin" className="form-label">Min Price</label>
            <input
              type="number"
              id="priceMin"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleChange}
              placeholder="Min"
              className="form-control"
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="priceMax" className="form-label">Max Price</label>
            <input
              type="number"
              id="priceMax"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleChange}
              placeholder="Max"
              className="form-control"
            />
          </div>

          {/* Search Button */}
          <div className="col-md-1 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              🔍
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}