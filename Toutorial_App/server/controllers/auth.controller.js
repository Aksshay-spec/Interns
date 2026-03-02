import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";
import { sendTenantMail } from "../services/mail/mail.service.js";
import { MAIL_TYPES } from "../services/mail/mail.constant.js";

export const registerTenant = async (req, res) => {
  try {
    const { tenantName, name, email, password } = req.body;

    if (!tenantName || !name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "tenant",
      tenantId: null,
      status: "inactive",
    });


    const tenant = await Tenant.create({
      name: tenantName,
      ownerUserId: user._id,
      status: "inactive",
      plan: "free",
    });


    user.tenantId = tenant._id;
    await user.save();
    // Send mail to admin
    sendTenantMail(
      MAIL_TYPES.TENANT_REGISTER_ADMIN,
      {
        name: user.name,
        email: process.env.ADMIN_EMAIL,
      }
    ).catch(err => console.error("Admin Mail Error:", err));

    // Send welcome mail to tenant
    sendTenantMail(
      MAIL_TYPES.TENANT_WELCOME,
      {
        name: user.name,
        email:user.email,
      }
    )
    return res.status(201).json({
      message: "Registration submitted. Wait for admin approval.",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check tenant status for non-superadmin users
    if (user.role !== "superadmin") {
      const tenant = await Tenant.findById(user.tenantId);

      if (!tenant) {
        return res.status(403).json({
          message: "Tenant not found. Please contact support.",
        });
      }

      if (tenant.status === "inactive") {
        return res.status(403).json({
          message: "Your account is pending admin approval. Please wait for approval.",
        });
      }

      if (tenant.status === "blocked") {
        return res.status(403).json({
          message: "Your account has been blocked. Please contact support.",
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        tenantId: user.tenantId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};