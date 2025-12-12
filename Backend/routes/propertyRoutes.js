import express from "express";
import {
  approvePropertyRequest,
  createPropertyRequest,
  deleteProperty,
  getAllProperties,
  getContactInfo,
  getFavorites,
  getMyProperties,
  getPropertyById,
  getPropertyRequests,
  getMyPropertyRequests,
  listProperties,
  rejectPropertyRequest,
  reportProperty,
  toggleFavorite,
  uploadToCloudinary,
  fetchNearbyOverpass,
} from "../controllers/propertyController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage (for Cloudinary)
// Increased limits: 50 MB for photos, 500 MB for videos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024, files: 20 }, // 500 MB max file size
});

// upload endpoint for Cloudinary
router.post("/upload", protect, upload.array("files", 20), uploadToCloudinary);
// nearby proxy (Overpass)
router.post("/nearby/overpass", fetchNearbyOverpass);

// property requests (sell form submissions)
router.post("/requests", protect, createPropertyRequest);
router.get("/requests/mine", protect, getMyPropertyRequests);
router.get("/requests/all", protect, requireAdmin, getPropertyRequests);
router.get("/all", protect, requireAdmin, getAllProperties);
router.patch("/requests/:id/approve", protect, requireAdmin, approvePropertyRequest);
router.patch("/requests/:id/reject", protect, requireAdmin, rejectPropertyRequest);

// favorites
router.get("/user/favorites/list", protect, getFavorites);
router.get("/user/mine", protect, getMyProperties);
router.post("/:id/favorite", protect, toggleFavorite);

// report
router.post("/:id/report", protect, reportProperty);

// delete property (admin only)
router.delete("/:id", protect, requireAdmin, deleteProperty);

// public listings
router.get("/:id/contact", protect, getContactInfo);
router.get("/:id", getPropertyById);
router.get("/", listProperties);

export default router;

