import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";
import { sendTenantMail } from "../services/mail/mail.service.js";
import { MAIL_TYPES } from "../services/mail/mail.constant.js";
import crypto from "crypto";

import { Tutor } from "../models/tutor.model.js";
import { Student } from "../models/student.model.js";


const dummyEmail = "savaraakshay2366@gmail.com";


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
      onlineStatus: false
    });

    const tenant = await Tenant.create({
      name: tenantName,
      ownerUserId: user._id,
      status: "inactive",
      plan: "free",
    });

    user.tenantId = tenant._id;
    await user.save();

    // Mail to admin
    sendTenantMail(
      MAIL_TYPES.TENANT_REGISTER_ADMIN,
      {
        name: user.name,
        email: dummyEmail
      }
    ).catch(err => console.error("Admin Mail Error:", err));

    // Mail to tenant
    sendTenantMail(
      MAIL_TYPES.TENANT_WELCOME,
      {
        name: user.name,
        email: dummyEmail
      }
    );

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

    if (user.status === "blocked" ) {
      return res.status(403).json({
        message: "Your account has been blocked"
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tenant validation
    if (user.role !== "superadmin") {

      

      const tenant = await Tenant.findById(user.tenantId);

      if (!tenant) {
        return res.status(403).json({
          message: "Tenant not found. Please contact support."
        });
      }

      if (tenant.status === "inactive") {
        return res.status(403).json({
          message: "Your account is pending admin approval."
        });
      }

      if (tenant.status === "blocked") {
        return res.status(403).json({
          message: "Your account has been blocked."
        });
      }

    }
    if(user.role === "student" || user.role === "tutor"){
      if(user.status === "inactive"){
        return res.status(403).json({
          message : "Your account is inactive. Please contact your tenant admin."
        })
      }
    }
    // console.log("user:", user);

    /* MARK USER ONLINE */
    user.onlineStatus = true;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        tenantId: user.tenantId
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
        tenantId: user.tenantId
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};



export const logoutUser = async (req, res) => {
  try {

    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      onlineStatus: false
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });

  }
};




export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    /* 🔹 FRONTEND RESET PAGE */
    const resetLink =
      `http://localhost:5173/reset-password/${resetToken}`;

    await sendTenantMail(
      MAIL_TYPES.PASSWORD_RESET,
      user,
      { resetLink }
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully."
    });

  } catch (error) {

    console.error("Forgot Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong."
    });

  }
};




export const resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or expired."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.passwordHash = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully."
    });

  } catch (error) {

    console.error("Reset Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong."
    });

  }
};



export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-passwordHash");

    let roleData = {};

    if (user.role === "student") {
      roleData = await Student.findOne({ userId });
    }

    if (user.role === "tutor") {
      roleData = await Tutor.findOne({ userId });
    }

    if (user.role === "tenant") {
      roleData = await Tenant.findOne({ ownerUserId: userId });
    }

    res.status(200).json({
      success: true,
      user,
      roleData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};