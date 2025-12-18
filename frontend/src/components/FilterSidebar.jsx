import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const FilterSidebar = ({ filters, setFilters, onApplyFilters }) => {
  const { t } = useLanguage();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-sidebar">
      <h5>Filter Properties</h5>
      
      <div className="mb-3">
        <label className="form-label">Location</label>
        <input
          type="text"
          className="form-control"
          name="city"
          value={filters.city || ''}
          onChange={handleChange}
          placeholder="e.g., Kathmandu"
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Property Type</label>
        <select
          className="form-select"
          name="propertyType"
          value={filters.propertyType || ''}
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Price Range</label>
        <div className="row g-2">
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleChange}
              placeholder="Min"
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleChange}
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Bedrooms</label>
        <select
          className="form-select"
          name="bedrooms"
          value={filters.bedrooms || ''}
          onChange={handleChange}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Bathrooms</label>
        <select
          className="form-select"
          name="bathrooms"
          value={filters.bathrooms || ''}
          onChange={handleChange}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>
      
      <button
        className="btn btn-primary w-100"
        onClick={onApplyFilters}
      >
        Apply Filters
      </button>
      
      <button
        className="btn btn-outline-secondary w-100 mt-2"
        onClick={() => {
          setFilters({});
          onApplyFilters({});
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar;