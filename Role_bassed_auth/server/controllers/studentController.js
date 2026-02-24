import Student from "../models/Student.js";
import bcrypt from "bcryptjs";

export const studentDashboard = async (req, res) => {

  const student = await Student.findById(req.user.id).select("-password");
 

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json({
    message: "Student dashboard data",
    profile: student,
  });
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await Student.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password required" });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    
    if (name) user.name = name;
    if (email) user.email = email;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};

