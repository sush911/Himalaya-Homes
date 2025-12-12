import express from "express";
import {
  submitContact,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit contact form (logged-in users only)
router.post("/", protect, submitContact);

// Admin routes
router.get("/", protect, requireAdmin, getContactMessages);
router.patch("/:id/status", protect, requireAdmin, updateContactStatus);
router.delete("/:id", protect, requireAdmin, deleteContactMessage);

export default router;

