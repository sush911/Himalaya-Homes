import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profilePic: { type: String, default: "" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  citizenshipNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
