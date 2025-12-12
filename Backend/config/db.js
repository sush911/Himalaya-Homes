import mongoose from "mongoose";
import Property from "../models/Property.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    
    // Drop problematic geospatial indexes that conflict with {lat, lng} format
    try {
      const existingIndexes = await Property.collection.getIndexes();
      const geoSpatialIndexes = Object.keys(existingIndexes).filter(name => 
        name.includes("2dsphere") || (name.includes("geo") && name.includes("2dsphere"))
      );
      
      if (geoSpatialIndexes.length > 0) {
        console.log(`⚠️  Found ${geoSpatialIndexes.length} geospatial index(es) to drop: ${geoSpatialIndexes.join(", ")}`);
        for (const indexName of geoSpatialIndexes) {
          try {
            await Property.collection.dropIndex(indexName);
            console.log(`✅ Dropped geospatial index: ${indexName}`);
          } catch (dropErr) {
            // Index might not exist or already dropped
            if (!dropErr.message?.includes("index not found")) {
              console.warn(`⚠️  Could not drop index ${indexName}: ${dropErr.message}`);
            }
          }
        }
        console.log("✅ Geospatial index cleanup completed");
      }
    } catch (indexErr) {
      console.warn("⚠️  Could not check/drop geospatial indexes:", indexErr.message);
      // Continue - this is not critical for server startup
    }
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
