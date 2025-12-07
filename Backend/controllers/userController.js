import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Update basic fields
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // If frontend sent a base64 profilePic in body (signup path), accept it
    if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }

    // If multer processed a file upload, save its public path
    if (req.file && req.file.filename) {
      // store a path accessible from frontend
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Updated successfully", profilePic: user.profilePic });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
