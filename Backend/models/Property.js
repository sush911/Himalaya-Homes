const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  propertyType: {
    type: String,
    required: [true, 'Please specify property type'],
    enum: ['house', 'apartment', 'villa', 'land', 'commercial', 'office']
  },
  listingType: {
    type: String,
    required: [true, 'Please specify listing type'],
    enum: ['sale', 'rent']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending'],
    default: 'available'
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide an address']
    },
    city: {
      type: String,
      required: [true, 'Please provide a city']
    },
    state: String,
    country: {
      type: String,
      default: 'Nepal'
    },
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please specify number of bedrooms'],
    min: 0
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please specify number of bathrooms'],
    min: 0
  },
  area: {
    value: {
      type: Number,
      required: [true, 'Please provide area']
    },
    unit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    }
  },
  yearBuilt: Number,
  amenities: [{
    type: String
  }],
  images: [{
    url: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search optimization
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'location.city': 1, propertyType: 1, listingType: 1 });

module.exports = mongoose.model('Property', propertySchema);