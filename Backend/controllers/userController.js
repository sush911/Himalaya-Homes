import User from "../models/User.js";

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    await user.save();
    res.json({ message: "Updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
