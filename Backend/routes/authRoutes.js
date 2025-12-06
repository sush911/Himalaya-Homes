import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getProfile);
router.put("/update", protect, upload.single('profilePic'), updateProfile);

export default router;
