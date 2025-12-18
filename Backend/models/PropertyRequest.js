import mongoose from "mongoose";

const nearbySchema = new mongoose.Schema({
  name: String,
  type: String,
  distanceKm: Number,
}, { _id: false });

const mediaArraySchema = [{ type: String }];

const propertyRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  propertyType: { type: String, enum: ["house", "building", "apartment", "land"], required: true },
  listingType: { type: String, enum: ["sale", "rent"], required: true }, // sale -> buy page, rent -> rent page
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    country: { type: String, default: "Nepal" },
    zipCode: String,
    coordinates: { lat: Number, lng: Number },
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
  amenities: [{ type: String }],
  media: {
    lalpurjaPhotos: mediaArraySchema,
    propertyPhotos: mediaArraySchema,
    propertyVideos: mediaArraySchema,
    roadPhotos: mediaArraySchema,
    roadVideos: mediaArraySchema,
  },
  nearby: {
    education: [nearbySchema],
    food: [nearbySchema],
    health: [nearbySchema],
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminNotes: String,
}, { timestamps: true });

const PropertyRequest = mongoose.model("PropertyRequest", propertyRequestSchema);
export default PropertyRequest;

