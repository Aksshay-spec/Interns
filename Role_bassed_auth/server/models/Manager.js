import mongoose from "mongoose";

const managerSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "manager" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Manager", managerSchema);
