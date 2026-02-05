import bcrypt from "bcryptjs";
import Manager from "../models/Manager.js";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";



export const addmanager = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log("Register User - Request Body:", req.body);

    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const adminExists = await Admin.findOne({ email });
    const managerExists = await Manager.findOne({ email });
    const studentExists = await Student.findOne({ email });

    if (adminExists || managerExists || studentExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      const manager = await Manager.create({
        name,
        email,
        password: hashedPassword,
        createdBy: req.user.id,
      });
  

      return res.status(201).json({
        message: "Manager registered successfully",
        user: manager,
      });
  } catch (error) {
    res.status(500).json({ message: "Error in registering manager" });
  }
};
export const addstudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log("Register User - Request Body:", req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const adminExists = await Admin.findOne({ email });
    const managerExists = await Manager.findOne({ email });
    const studentExists = await Student.findOne({ email });

    if (adminExists || managerExists || studentExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      const student = await Student.create({
        name,
        email,
        password: hashedPassword,
        createdBy: req.user.id,
      });
      return res.status(201).json({
        message: "Student registered successfully",
        user: student,
      });
  } catch (error) {
    res.status(500).json({ message: "Error in registering student"});
  }
};

export const adminDashboard = async (req, res) => {
  const managersCount = await Manager.countDocuments();
  const studentsCount = await Student.countDocuments();

  res.json({
    message: "Admin dashboard data",
    stats: {
      managers: managersCount,
      students: studentsCount,
    },
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

    const user = await Admin.findById(userId);

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