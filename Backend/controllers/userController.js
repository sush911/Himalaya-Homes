import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Update basic fields
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // Accept base64 profile pic
    if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }

    // Accept multer upload
    if (req.file?.filename) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Updated successfully", profilePic: user.profilePic });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};