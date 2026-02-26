import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import express from "express";
import {
  approveTenant,
  rejectTenant,
  blockTenant,
  getPendingTenants,
  getAllTenants,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin dashboard
router.get(
  "/admin-dashboard",
  authMiddleware,
  authorizeRoles("superadmin"),
  (req, res) => {
    res.json({ message: "Welcome Superadmin " });
  }
);

// Get all tenants
router.get(
  "/tenants",
  authMiddleware,
  authorizeRoles("superadmin"),
  getAllTenants
);

// Get pending tenant requests
router.get(
  "/tenants/pending",
  authMiddleware,
  authorizeRoles("superadmin"),
  getPendingTenants
);

// Approve tenant
router.patch(
  "/tenants/:id/approve",
  authMiddleware,
  authorizeRoles("superadmin"),
  approveTenant
);

// Reject tenant
router.patch(
  "/tenants/:id/reject",
  authMiddleware,
  authorizeRoles("superadmin"),
  rejectTenant
);

// Block tenant
router.patch(
  "/tenants/:id/block",
  authMiddleware,
  authorizeRoles("superadmin"),
  blockTenant
);

export default router;