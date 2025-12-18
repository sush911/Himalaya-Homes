import mongoose from "mongoose";

const nearbySchema = new mongoose.Schema({
  name: String,
  type: String,
  distanceKm: Number,
}, { _id: false });

const mediaArraySchema = [{ type: String }];

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [2000, "Description cannot be more than 2000 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  propertyType: {
    type: String,
    required: [true, "Please specify property type"],
    enum: ["house", "building", "apartment", "land"],
  },
  listingType: {
    type: String,
    required: [true, "Please specify listing type"],
    enum: ["sale", "rent"],
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["available", "sold", "rented", "pending"],
    default: "available",
  },
  location: {
    address: { type: String, required: [true, "Please provide an address"] },
    city: { type: String, required: [true, "Please provide a city"] },
    state: String,
    country: { type: String, default: "Nepal" },
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  bedrooms: { type: Number, min: 0 },
  bathrooms: { type: Number, min: 0 },
  floors: { type: Number, min: 0 },
  parking: { type: Number, min: 0 },
  constructionYear: { type: Number },
  area: {
    sqft: { type: Number },
    ana: { type: Number },
    ropani: { type: Number },
  },
  yearBuilt: Number, // keep for backward compat
  amenities: [{ type: String }],

  // media buckets
  media: {
    lalpurjaPhotos: mediaArraySchema,      // up to 4
    propertyPhotos: mediaArraySchema,     // up to 20
    propertyVideos: mediaArraySchema,     // up to 2
    roadPhotos: mediaArraySchema,         // up to 6
    roadVideos: mediaArraySchema,         // up to 2
  },

  nearby: {
    education: [nearbySchema],
    food: [nearbySchema],
    health: [nearbySchema],
  },

  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },

  reports: [
    {
      reason: { type: String, enum: ["fraudulent", "suspicious", "scam"] },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

propertySchema.index({ title: "text", description: "text" });
propertySchema.index({ "location.city": 1, propertyType: 1, listingType: 1 });
// Note: Not creating geospatial index on coordinates to avoid "Can't extract geo keys" error
// Coordinates are stored as {lat, lng} object, not GeoJSON format

const Property = mongoose.model("Property", propertySchema);
export default Property;