// Load environment variables FIRST (in case this module is imported before dotenv.config() in server.js)
import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

// 🔍 DEBUG: Check if environment variables are loaded
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("🔎 Cloudinary Debug:");
console.log("Cloud Name:", cloudName || "❌ Missing");
console.log("API Key:", apiKey ? `${apiKey.substring(0, 5)}...` : "❌ Missing");
console.log("API Secret:", apiSecret ? "Loaded ✔" : "❌ Missing");

// Validate config before setting
if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ ERROR: Cloudinary configuration is incomplete!");
  console.error("Please check your .env file has all three variables:");
  console.error("  CLOUDINARY_CLOUD_NAME");
  console.error("  CLOUDINARY_API_KEY");
  console.error("  CLOUDINARY_API_SECRET");
} else {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  console.log("✅ Cloudinary configured successfully");
}

export default cloudinary;
