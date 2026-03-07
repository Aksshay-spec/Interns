import express from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { updateProfile } from "../controllers/student.controller.js";
import { upload } from "../configs/multer.js";

const router = express.Router();

// Placeholder route for student dashboard
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Student dashboard data' });
});

router.put("/profile",
    authMiddleware,
    authorizeRoles("student"),
    upload.single("profileImage"),
    updateProfile
);

export default router;

