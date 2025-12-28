import express from "express";
import {
  approvePropertyRequest,
  createPropertyRequest,
  deleteProperty,
  deletePropertyRequest,
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
  addReview,
  getReviews,
  verifyProperty,
} from "../controllers/propertyController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// upload endpoint for local storage
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
router.delete("/requests/:id", protect, requireAdmin, deletePropertyRequest);

// favorites
router.get("/user/favorites/list", protect, getFavorites);
router.get("/user/mine", protect, getMyProperties);
router.post("/:id/favorite", protect, toggleFavorite);

// report
router.post("/:id/report", protect, reportProperty);

// delete property (admin only)
router.delete("/:id", protect, requireAdmin, deleteProperty);

// reviews and ratings
router.post("/:id/reviews", protect, addReview);
router.get("/:id/reviews", getReviews);

// verify property (admin only)
router.patch("/:id/verify", protect, requireAdmin, verifyProperty);

// public listings
router.get("/:id/contact", protect, getContactInfo);
router.get("/:id", getPropertyById);
router.get("/", listProperties);

export default router;

