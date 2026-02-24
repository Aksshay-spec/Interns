import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "student" },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    profileImage: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
