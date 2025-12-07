import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/register", upload.single('profilePic'), registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update", protect, upload.single('profilePic'), updateProfile);

export default router;
