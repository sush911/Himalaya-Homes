import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/userController.js";
import upload from "../middleware/upload.js";

import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendResetCode } from "../api/emailService.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);

// FORGOT-PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetCode = crypto.randomInt(100000, 999999).toString();

    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendResetCode(email, resetCode);

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset code", error: err.message });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetCode: code,
      resetCodeExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired code" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
});

// PROTECTED ROUTES
router.get("/me", protect, getMe);
router.put("/update", protect, upload.single("profilePic"), updateProfile);

export default router;