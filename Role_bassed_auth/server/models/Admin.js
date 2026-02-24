import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "admin" },
    profileImage: {type: String}
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
