import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";

// Register a tutor (by tenant)
export const registerTutor = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const tenantId = req.user.tenantId; // From auth middleware

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create tutor user
    const tutorUser = await User.create({
      name,
      email,
      passwordHash,
      role: "tutor",
      tenantId: tenantId,
      status: "active", // Tutor is active immediately
    });

    return res.status(201).json({
      message: "Tutor registered successfully",
      tutor: {
        _id: tutorUser._id,
        name: tutorUser.name,
        email: tutorUser.email,
        role: tutorUser.role,
      },
    });
  } catch (error) {
    console.error("Tutor Registration Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get all tutors for a tenant
export const getTutorsByTenant = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const tutors = await User.find({
      tenantId: tenantId,
      role: "tutor",
    }).select("-passwordHash");

    return res.status(200).json({
      message: "Tutors fetched successfully",
      tutors,
    });
  } catch (error) {
    console.error("Get Tutors Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete a tutor
export const deleteTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const tenantId = req.user.tenantId;

    const tutor = await User.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Check if tutor belongs to this tenant
    if (tutor.tenantId.toString() !== tenantId.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete tutors in your tenant",
      });
    }

    await User.findByIdAndDelete(tutorId);

    return res.status(200).json({
      message: "Tutor deleted successfully",
    });
  } catch (error) {
    console.error("Delete Tutor Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};