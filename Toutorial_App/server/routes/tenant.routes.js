import express from "express";
import {
    registerTutor,
    getTutorsByTenant,
    deleteTutor,
    
} from "../controllers/tenant.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Register a tutor (tenant only)
router.post(
    "/register/tutor",
    authMiddleware,
    authorizeRoles("tenant"),
    registerTutor
);

// Get all tutors for a tenant (tenant only)
router.get(
    "/tutors",
    authMiddleware,
    authorizeRoles("tenant"),
    getTutorsByTenant
);



// Delete a tutor (tenant only)
router.delete(
    "/:tutorId",
    authMiddleware,
    authorizeRoles("tenant"),
    deleteTutor
);

export default router;