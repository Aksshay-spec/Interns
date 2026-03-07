import express from "express";

import {
  registerTenant,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


// Tenant self registration
router.post("/register", registerTenant);

// Login (superadmin, tenant, tutor, student)
router.post("/login", loginUser);

// Logout (sets onlineStatus = false)
router.post("/logout", authMiddleware, logoutUser);

// Get logged in user
router.get("/my-profile", authMiddleware, getProfile);



// Request reset email
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

export default router;