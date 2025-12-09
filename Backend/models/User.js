import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profilePic: { type: String, default: "" },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    phone: { type: String, required: true },
    citizenshipNumber: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ROLE FIELD (NEW)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Forgot Password Fields
    resetCode: { type: String, default: null },
    resetCodeExpiry: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
