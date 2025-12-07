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

export default function AdvancedSearchBar() {
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    priceMin: "",
    priceMax: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search logic (navigate with query params or call API)
    console.log("Search with filters:", filters);
    // Example: navigate(`/search?type=${filters.propertyType}&location=${filters.location}&minPrice=${filters.priceMin}&maxPrice=${filters.priceMax}`);
  };

  return (
    <div className="advanced-search-bar">
      <form onSubmit={handleSearch} className="search-form">
        {/* Property Type */}
        <div className="search-filter">
          <label htmlFor="propertyType" className="filter-label">Property Type</label>
          <select
            id="propertyType"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="filter-input filter-select"
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
        <div className="search-filter">
          <label htmlFor="location" className="filter-label">Location</label>
          <select
            id="location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="filter-input filter-select"
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
        <div className="search-filter">
          <label htmlFor="priceMin" className="filter-label">Min Price</label>
          <input
            type="number"
            id="priceMin"
            name="priceMin"
            value={filters.priceMin}
            onChange={handleChange}
            placeholder="Min"
            className="filter-input"
          />
        </div>

        <div className="search-filter">
          <label htmlFor="priceMax" className="filter-label">Max Price</label>
          <input
            type="number"
            id="priceMax"
            name="priceMax"
            value={filters.priceMax}
            onChange={handleChange}
            placeholder="Max"
            className="filter-input"
          />
        </div>

        {/* Search Button */}
        <button type="submit" className="search-btn">
          🔍 Search
        </button>
      </form>
    </div>
  );
}
