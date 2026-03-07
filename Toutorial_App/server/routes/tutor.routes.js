import express from 'express';
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { updateProfile } from "../controllers/tutor.controller.js";
import { upload } from "../configs/multer.js";

const router = express.Router();

// Placeholder route for tutor dashboard
router.get('/dashboard', (req, res) => {
    res.json({ message: 'Tutor dashboard data' });
});

router.put("/profile",
    authMiddleware,
    authorizeRoles("tutor"),
    upload.single("profileImage"),
    updateProfile
);

export default router;

