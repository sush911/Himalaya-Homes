import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getPublicAgents,
} from "../controllers/agentController.js";

const router = express.Router();

// Public listing
router.get("/public", getPublicAgents);

// Admin-only CRUD
router.get("/", protect, requireAdmin, getAgents);
router.post("/", protect, requireAdmin, createAgent);
router.get("/:id", protect, requireAdmin, getAgentById);
router.put("/:id", protect, requireAdmin, updateAgent);
router.delete("/:id", protect, requireAdmin, deleteAgent);

export default router;
