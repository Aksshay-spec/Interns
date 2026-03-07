import {User} from "../models/user.model.js";


import bcrypt from "bcryptjs";

import { Student } from "../models/student.model.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      newPassword,
      confirmPassword,
      rollNumber,
      classLevel,
      board,
      phone,
      parentName,
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

   

    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    if (rollNumber) student.rollNumber = rollNumber;
    if (classLevel) student.classLevel = classLevel;
    if (board) student.board = board;
    if (phone) student.phone = phone;
    if (parentName) student.parentName = parentName;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      user,
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};