import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token (UPDATED: now includes role)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// SIGNUP
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      citizenshipNumber,
      email,
      password,
      role // optional
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile picture from multer
    let profilePic = "";
    if (req.file?.filename) {
      profilePic = `/uploads/${req.file.filename}`;
    }

    // Safe role assignment (admin can create admin)
    let finalRole = "user";
    if (req.user && req.user.role === "admin" && role) {
      finalRole = role;
    }

    const user = await User.create({
      firstName,
      lastName,
      phone,
      citizenshipNumber,
      email,
      password: hashedPassword,
      profilePic,
      role: finalRole
    });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  res.json(req.user);
};