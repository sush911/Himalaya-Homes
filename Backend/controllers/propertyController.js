import Property from "../models/Property.js";
import PropertyRequest from "../models/PropertyRequest.js";
import User from "../models/User.js";
import axios from "axios";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Helper function to convert media URLs from {original, thumbnail} to just original
const convertToOriginalUrls = (media) => {
  const converted = {};
  for (const [key, urls] of Object.entries(media)) {
    if (Array.isArray(urls)) {
      converted[key] = urls.map(url => 
        typeof url === 'object' && url.original ? url.original : url
      );
    } else {
      converted[key] = urls;
    }
  }
  return converted;
};


const debugLog = (payload) => {
  fetch("http://127.0.0.1:7242/ingest/4f3578ae-088b-480c-b3c4-4caa0f2750ac", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      timestamp: Date.now(),
      ...payload,
    }),
  }).catch(() => {});
};


// Upload files to local storage
export const uploadToCloudinary = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const folder = req.body.folder || "properties";
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    
    // Ensure thumbnails folder exists
    const thumbFolder = `uploads/thumbnails`;
    if (!fs.existsSync(thumbFolder)) {
      fs.mkdirSync(thumbFolder, { recursive: true });
    }
    
    const urls = [];
    
    for (const file of req.files) {
      const isImage = file.mimetype?.startsWith("image/");
      const originalUrl = `${baseUrl}/uploads/properties/${file.filename}`;
      
      if (isImage) {
        // Create thumbnail for images (400px width, maintains aspect ratio)
        const thumbFilename = `thumb_${file.filename}`;
        const thumbPath = path.join(thumbFolder, thumbFilename);
        
        try {
          await sharp(file.path)
            .resize(400, null, { 
              withoutEnlargement: true,
              fit: 'inside'
            })
            .jpeg({ quality: 60, progressive: true })
            .toFile(thumbPath);
          
          // Return both original and thumbnail URLs
          urls.push({
            original: originalUrl,
            thumbnail: `${baseUrl}/uploads/thumbnails/${thumbFilename}`
          });
        } catch (err) {
          console.error('Thumbnail creation failed:', err);
          // If thumbnail fails, just use original
          urls.push({
            original: originalUrl,
            thumbnail: originalUrl
          });
        }
      } else {
        // For videos, no thumbnail - just return original
        urls.push({
          original: originalUrl,
          thumbnail: originalUrl
        });
      }
    }

    console.log(`✅ Uploaded ${urls.length} file(s) to local storage (folder: ${folder})`);
    console.log('Sample:', urls[0]);
    res.json({ urls });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ 
      message: err.message || "Upload failed",
    });
  }
};

// Proxy Overpass to avoid browser CORS issues
export const fetchNearbyOverpass = async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ message: "lat/lng required" });
  
  const tagGroups = {
    education: ["school", "college", "university"],
    food: ["restaurant", "cafe", "fast_food"],
    health: ["clinic", "hospital", "doctors"],
  };

  try {
    const fetchGroup = async (tags) => {
      const query = `
        [out:json][timeout:25];
        (
          ${tags.map((t) => `node["amenity"="${t}"](around:1200,${lat},${lng});`).join("\n")}
        );
        out body;
      `;
      
      try {
        const response = await axios.post("https://overpass-api.de/api/interpreter", query, {
          headers: { "Content-Type": "text/plain" },
          timeout: 30000, // 30 second timeout
        });
        
        if (!response.data || !response.data.elements) {
          console.warn("Overpass API returned no elements");
          return [];
        }
        
        return response.data.elements
          .map((el) => ({
            name: el.tags?.name || el.tags?.amenity || "Unknown",
            type: el.tags?.amenity,
            distanceKm: el.tags?.distance || 0,
          }))
          .slice(0, 3);
      } catch (apiError) {
        console.error(`Overpass API error for tags ${tags}:`, apiError.message);
        return []; // Return empty array on error instead of failing
      }
    };

    const [education, food, health] = await Promise.all([
      fetchGroup(tagGroups.education),
      fetchGroup(tagGroups.food),
      fetchGroup(tagGroups.health),
    ]);

    res.json({ education, food, health });
  } catch (err) {
    console.error("Nearby fetch error:", err.message);
    // Return empty results instead of error to allow form submission
    res.json({ education: [], food: [], health: [] });
  }
};

export const createPropertyRequest = async (req, res) => {
  try {
    
    debugLog({
      hypothesisId: "A",
      location: "propertyController.js:createPropertyRequest",
      message: "request received",
      data: { 
        hasMedia: !!req.body.media,
        mediaKeys: req.body.media ? Object.keys(req.body.media) : [],
        listingType: req.body.listingType,
        propertyType: req.body.propertyType,
      },
    });
   

    // Media should already be Cloudinary URLs from frontend upload
    const media = req.body.media || {};

    // Accept province alias from frontend; map to state for schema compatibility
    const location = req.body.location || {};
    const mappedLocation = {
      ...location,
      state: location.province || location.state,
    };

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!req.body.description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!req.body.price) {
      return res.status(400).json({ message: "Price is required" });
    }
    if (!req.body.propertyType) {
      return res.status(400).json({ message: "Property type is required" });
    }
    if (!req.body.listingType) {
      return res.status(400).json({ message: "Listing type (sale/rent) is required" });
    }
    if (!location.address || !location.city) {
      return res.status(400).json({ message: "Address and city are required" });
    }
    if (!location.coordinates?.lat || !location.coordinates?.lng) {
      return res.status(400).json({ message: "Map coordinates are required" });
    }

    const payload = {
      ...req.body,
      media: {
        lalpurjaPhotos: Array.isArray(media.lalpurjaPhotos) ? media.lalpurjaPhotos : [],
        propertyPhotos: Array.isArray(media.propertyPhotos) ? media.propertyPhotos : [],
        propertyVideos: Array.isArray(media.propertyVideos) ? media.propertyVideos : [],
        roadPhotos: Array.isArray(media.roadPhotos) ? media.roadPhotos : [],
        roadVideos: Array.isArray(media.roadVideos) ? media.roadVideos : [],
      },
      location: mappedLocation,
      postedBy: req.user._id,
    };

    
    debugLog({
      hypothesisId: "A",
      location: "propertyController.js:createPropertyRequest",
      message: "creating property request",
      data: { 
        listingType: payload.listingType, 
        propertyType: payload.propertyType,
        mediaCounts: {
          lalpurja: payload.media.lalpurjaPhotos.length,
          photos: payload.media.propertyPhotos.length,
          videos: payload.media.propertyVideos.length,
          roadPhotos: payload.media.roadPhotos.length,
          roadVideos: payload.media.roadVideos.length,
        },
      },
    });
    

    const request = await PropertyRequest.create(payload);
    
    
    debugLog({
      hypothesisId: "A",
      location: "propertyController.js:createPropertyRequest",
      message: "property request created successfully",
      data: { requestId: request._id.toString() },
    });
    

    res.status(201).json(request);
  } catch (err) {
    
    debugLog({
      hypothesisId: "D",
      location: "propertyController.js:createPropertyRequest",
      message: "submission failed",
      data: { 
        error: err.message,
        errorName: err.name,
        validationErrors: err.errors ? Object.keys(err.errors) : [],
        stack: err.stack?.substring(0, 300),
      },
    });
    
    
    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ message: `Validation error: ${errors}` });
    }
    
    res.status(400).json({ message: err.message || "Failed to create property request" });
  }
};

export const getPropertyRequests = async (req, res) => {
  const { status = "pending" } = req.query;
  const requests = await PropertyRequest.find({ status }).populate("postedBy", "firstName lastName email phone");
  res.json(requests);
};

export const getMyPropertyRequests = async (req, res) => {
  const requests = await PropertyRequest.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(requests);
};

export const approvePropertyRequest = async (req, res) => {
  try {
    
    debugLog({
      hypothesisId: "A",
      location: "propertyController.js:approvePropertyRequest",
      message: "function entry",
      data: { requestId: req.params.id },
    });
    

    const request = await PropertyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") return res.status(400).json({ message: "Already processed" });

    
    debugLog({
      hypothesisId: "A",
      location: "propertyController.js:approvePropertyRequest",
      message: "request fetched",
      data: { 
        requestId: request._id.toString(),
        hasCoordinates: !!request.location?.coordinates,
        coordinates: request.location?.coordinates,
      },
    });
    

    // Note: Geospatial indexes are now dropped at server startup (db.js)
    // This check is kept for logging/debugging purposes
    try {
      const existingIndexes = await Property.collection.getIndexes();
      const geoSpatialIndexes = Object.keys(existingIndexes).filter(name => 
        name.includes("2dsphere") || (name.includes("geo") && name.includes("2dsphere"))
      );
      
      
      debugLog({
        hypothesisId: "A",
        location: "propertyController.js:approvePropertyRequest",
        message: "existing indexes checked",
        data: { 
          indexCount: Object.keys(existingIndexes).length,
          indexNames: Object.keys(existingIndexes),
          hasGeoSpatialIndex: geoSpatialIndexes.length > 0,
          geoSpatialIndexes,
        },
      });
      
      
      if (geoSpatialIndexes.length > 0) {
        
        debugLog({
          hypothesisId: "A",
          location: "propertyController.js:approvePropertyRequest",
          message: "WARNING: geospatial indexes still exist",
          data: { geoSpatialIndexes },
        });
        
        console.warn(`⚠️  WARNING: Geospatial indexes still exist: ${geoSpatialIndexes.join(", ")}. They should have been dropped at startup.`);
      }
    } catch (indexErr) {
      
      debugLog({
        hypothesisId: "A",
        location: "propertyController.js:approvePropertyRequest",
        message: "index check failed",
        data: { error: indexErr.message },
      });
      
    }

    // Ensure coordinates are valid numbers (fix geospatial error)
    const location = { ...request.location };
    if (location.coordinates) {
      location.coordinates = {
        lat: Number(location.coordinates.lat) || 0,
        lng: Number(location.coordinates.lng) || 0,
      };
      // Validate coordinates are within reasonable range
      if (location.coordinates.lat === 0 && location.coordinates.lng === 0) {
        return res.status(400).json({ message: "Invalid coordinates. Please ensure map pin is set correctly." });
      }
    }

    
    debugLog({
      hypothesisId: "C",
      location: "propertyController.js:approvePropertyRequest",
      message: "location prepared",
      data: { 
        locationStructure: JSON.stringify(location).substring(0, 500),
        coordinatesType: typeof location.coordinates,
        coordinatesIsObject: location.coordinates && typeof location.coordinates === "object",
        latType: typeof location.coordinates?.lat,
        lngType: typeof location.coordinates?.lng,
      },
    });
    

    const propertyData = {
      title: request.title,
      description: request.description,
      price: request.price,
      propertyType: request.propertyType,
      listingType: request.listingType,
      location: location,
      bedrooms: request.bedrooms || 0,
      bathrooms: request.bathrooms || 0,
      floors: request.floors || 0,
      parking: request.parking || 0,
      constructionYear: request.constructionYear,
      area: request.area || {},
      amenities: request.amenities || [],
      media: convertToOriginalUrls(request.media || {}),
      nearby: request.nearby || {},
      postedBy: request.postedBy,
      isApproved: true,
      status: "available",
    };

    console.log("📸 Media being saved:", JSON.stringify(propertyData.media, null, 2));

    
    debugLog({
      hypothesisId: "C",
      location: "propertyController.js:approvePropertyRequest",
      message: "property data prepared before create",
      data: { 
        locationInData: JSON.stringify(propertyData.location).substring(0, 300),
        coordinatesInData: JSON.stringify(propertyData.location?.coordinates).substring(0, 200),
        hasPostedBy: !!propertyData.postedBy,
        postedByType: typeof propertyData.postedBy,
      },
    });
    

    
    debugLog({
      hypothesisId: "E",
      location: "propertyController.js:approvePropertyRequest",
      message: "about to call Property.create",
      data: { 
        propertyDataKeys: Object.keys(propertyData),
        locationKeys: propertyData.location ? Object.keys(propertyData.location) : [],
      },
    });
   

    const property = await Property.create(propertyData);

    request.status = "approved";
    await request.save();

    await User.findByIdAndUpdate(request.postedBy, { $addToSet: { myListings: property._id } });

    
    debugLog({
      hypothesisId: "C",
      location: "propertyController.js:approvePropertyRequest",
      message: "property approved",
      data: { propertyId: property._id.toString(), listingType: property.listingType },
    });
   

    
    debugLog({
      hypothesisId: "E",
      location: "propertyController.js:approvePropertyRequest",
      message: "property created successfully",
      data: { 
        propertyId: property._id.toString(),
        propertyLocation: JSON.stringify(property.location).substring(0, 300),
      },
    });
   

    request.status = "approved";
    await request.save();

    await User.findByIdAndUpdate(request.postedBy, { $addToSet: { myListings: property._id } });

    
    debugLog({
      hypothesisId: "C",
      location: "propertyController.js:approvePropertyRequest",
      message: "property approved",
      data: { propertyId: property._id.toString(), listingType: property.listingType },
    });
    

    res.json({ request, property });
  } catch (err) {
    // Try to get request for error details
    let requestData = null;
    try {
      requestData = await PropertyRequest.findById(req.params.id);
    } catch {}

    // Check indexes again in error case 
    let errorIndexes = [];
    try {
      errorIndexes = await Property.collection.getIndexes();
    } catch {}

    
    debugLog({
      hypothesisId: "A",
      location: "propertyController.js:approvePropertyRequest",
      message: "error - indexes at error time",
      data: {
        indexCount: Object.keys(errorIndexes).length,
        indexNames: Object.keys(errorIndexes),
        hasGeoSpatialIndex: Object.keys(errorIndexes).some(name => name.includes("2dsphere") || name.includes("geo") || name.includes("coordinates")),
        geoSpatialIndexDetails: Object.keys(errorIndexes).filter(name => name.includes("2dsphere") || name.includes("geo") || name.includes("coordinates")).map(name => ({ name, definition: JSON.stringify(errorIndexes[name]).substring(0, 200) })),
      },
    });
    

    
    debugLog({
      hypothesisId: "C",
      location: "propertyController.js:approvePropertyRequest",
      message: "approval failed",
      data: {
        error: err.message,
        errorName: err.name,
        errorCode: err.code,
        errorString: String(err),
        stack: err.stack?.substring(0, 800),
        hasCoordinates: !!requestData?.location?.coordinates,
        coordinates: requestData?.location?.coordinates,
        coordinatesType: typeof requestData?.location?.coordinates,
        requestId: req.params.id,
        isMongoError: err.name === "MongoServerError" || err.name === "MongoError",
        mongoErrorCode: err.code,
        mongoErrorCodeName: err.codeName,
      },
    });
    
    
    debugLog({
      hypothesisId: "E",
      location: "propertyController.js:approvePropertyRequest",
      message: "error details",
      data: {
        fullErrorKeys: Object.keys(err),
        errorMessage: err.message,
        errorName: err.name,
        errorCode: err.code,
        errorCodeName: err.codeName,
        errorString: String(err),
        errorJSON: JSON.stringify(err, Object.getOwnPropertyNames(err)).substring(0, 1000),
      },
    });
    
    
    // Handle geospatial errors specifically
    if (err.message?.includes("geo") || err.message?.includes("coordinates") || err.codeName === "CanExtractGeoKeys") {
      return res.status(400).json({ 
        message: `Geospatial error: ${err.message}. Please ensure coordinates are valid numbers.`,
        details: process.env.NODE_ENV === "development" ? { 
          coordinates: requestData?.location?.coordinates,
          errorCode: err.code,
          errorCodeName: err.codeName,
          hasGeoSpatialIndex: Object.keys(errorIndexes).some(name => name.includes("2dsphere") || name.includes("geo") || name.includes("coordinates")),
        } : undefined,
      });
    }
    
    res.status(400).json({ message: err.message || "Failed to approve property request" });
  }
};

export const rejectPropertyRequest = async (req, res) => {
  const request = await PropertyRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  request.status = "rejected";
  await request.save();
  res.json(request);
};

export const deletePropertyRequest = async (req, res) => {
  try {
    const request = await PropertyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    
    await PropertyRequest.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Deleted property request: ${req.params.id}`);
    
    res.json({ message: "Property request deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to delete property request" });
  }
};

export const listProperties = async (req, res) => {
  const { listingType, propertyType, city, search } = req.query;
  const filter = { isApproved: true };
  if (listingType) filter.listingType = listingType;
  if (propertyType) filter.propertyType = propertyType;
  if (city) filter["location.city"] = city;
  if (search) filter.$text = { $search: search };
  const properties = await Property.find(filter).populate("postedBy", "firstName lastName");
  res.json(properties);
};

export const getAllProperties = async (req, res) => {
  try {
    // Ensure reported properties are shown first for admin
    const properties = await Property.aggregate([
      { $addFields: { reportsCount: { $size: { $ifNull: ["$reports", []] } } } },
      { $sort: { reportsCount: -1, createdAt: -1 } },
    ]);

    // populate postedBy and report users
    await Property.populate(properties, [
      { path: "postedBy", select: "firstName lastName email" },
      { path: "reports.user", select: "firstName lastName email" },
    ]);
    res.json(properties);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to fetch properties" });
  }
};

export const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id).populate("postedBy", "firstName lastName email phone");
  if (!property) return res.status(404).json({ message: "Not found" });
  res.json(property);
};

export const toggleFavorite = async (req, res) => {
  const propertyId = req.params.id;
  const user = await User.findById(req.user._id);

  const exists = user.favorites.some((fav) => fav.toString() === propertyId);
  if (exists) {
    user.favorites = user.favorites.filter((fav) => fav.toString() !== propertyId);
  } else {
    user.favorites.push(propertyId);
  }
  await user.save();

  
  debugLog({
    hypothesisId: "B",
    location: "propertyController.js:toggleFavorite",
    message: "favorite toggled",
    data: { propertyId, added: !exists },
  });
  

  res.json({ favorites: user.favorites, added: !exists });
};

export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites);
};

export const getMyProperties = async (req, res) => {
  const properties = await Property.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(properties);
};

export const reportProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Not found" });
  const { reason } = req.body;
  if (!["fraudulent", "suspicious", "scam"].includes(reason)) {
    return res.status(400).json({ message: "Invalid reason" });
  }
  property.reports.push({ reason, user: req.user._id });
  await property.save();
  res.json({ message: "Reported", reports: property.reports.length });
};

export const getContactInfo = async (req, res) => {
  const property = await Property.findById(req.params.id).populate("postedBy", "firstName lastName email phone");
  if (!property) return res.status(404).json({ message: "Not found" });
  res.json({
    name: `${property.postedBy.firstName} ${property.postedBy.lastName}`,
    email: property.postedBy.email,
    phone: property.postedBy.phone,
  });
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    
    // Remove from user's myListings
    await User.findByIdAndUpdate(property.postedBy, {
      $pull: { myListings: property._id },
    });
    
    // Remove from all users' favorites
    await User.updateMany(
      { favorites: property._id },
      { $pull: { favorites: property._id } }
    );
    
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to delete property" });
  }
};

// Add review/rating to property
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user already reviewed this property
    const existingReview = property.reviews.find(
      (review) => review.user.toString() === userId
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment || "";
      existingReview.createdAt = new Date();
    } else {
      // Add new review
      property.reviews.push({
        user: userId,
        rating,
        comment: comment || "",
      });
    }

    // Calculate average rating
    const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
    property.averageRating = parseFloat((totalRating / property.reviews.length).toFixed(1));
    property.totalReviews = property.reviews.length;

    await property.save();

    const updatedProperty = await Property.findById(id).populate("reviews.user", "name email");
    res.json({ message: "Review added successfully", property: updatedProperty });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to add review" });
  }
};

// Get reviews for a property
export const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).populate("reviews.user", "name email");
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      averageRating: property.averageRating,
      totalReviews: property.totalReviews,
      reviews: property.reviews,
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to get reviews" });
  }
};

// Mark property as verified (admin only)
export const verifyProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.isVerified = true;
    await property.save();

    res.json({ message: "Property verified successfully", property });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to verify property" });
  }
};



