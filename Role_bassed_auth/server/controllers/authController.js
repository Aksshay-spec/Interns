import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";
import Manager from "../models/Manager.js";
import Student from "../models/Student.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await Admin.findOne({ email });
  let role = "admin";

  if (!user) {
    user = await Manager.findOne({ email });
    role = "manager";
  }

  if (!user) {
    user = await Student.findOne({ email });
    role = "student";
  }

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role,
      profileImage: user.profileImage || null,
    },
  });
};
