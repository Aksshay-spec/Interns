import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";

import { Tutor } from "../models/tutor.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      newPassword,
      confirmPassword,
      subjects,
      experienceYears,
      phone,
    } = req.body;

 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    // Password update
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

   

    const tutor = await Tutor.findOne({ userId });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor profile not found",
      });
    }

    if (subjects) tutor.subjects = subjects;
    if (experienceYears) tutor.experienceYears = experienceYears;
    if (phone) tutor.phone = phone;

    await tutor.save();

    res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully",
      user,
      tutor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};