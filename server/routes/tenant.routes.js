import express from "express";
import {
    registerTutor,
    getTutorsByTenant,
    deleteTutor,
    updateTutor,
    registerStudent,
    getStudentsByTenant,
    deleteStudent,
    updateStudent,
    updateProfile,
    getProfile
    
} from "../controllers/tenant.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../configs/multer.js";

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
    "/tutors/:tutorId",
    authMiddleware,
    authorizeRoles("tenant"),
    deleteTutor
);

router.put(
    "/tutors/:tutorId",
    authMiddleware,
    authorizeRoles("tenant"),
    updateTutor
);

// Register a student (tenant only)
router.post(
    "/register/student",
    authMiddleware,
    authorizeRoles("tenant"),
    registerStudent
);

// Get all students for a tenant (tenant only)
router.get(
    "/students",
    authMiddleware,
    authorizeRoles("tenant"),
    getStudentsByTenant
);

// Delete a student (tenant only)
router.delete(
    "/students/:studentId",
    authMiddleware,
    authorizeRoles("tenant"),
    deleteStudent
);

router.put(
    "/students/:studentId",
    authMiddleware,
    authorizeRoles("tenant"),
    updateStudent
);

//update profile
router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("tenant"),
  upload.single("profileImage"),
  updateProfile
);

router.get(
    "/profile",
    authMiddleware,
    authorizeRoles("tenant"),
    getProfile
);
export default router;