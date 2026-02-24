import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const createDefaultAdmin = async () => {
  const adminExists = await Admin.findOne({ email: "admin@example.com" });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    name: "Super Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Default admin created");
};
