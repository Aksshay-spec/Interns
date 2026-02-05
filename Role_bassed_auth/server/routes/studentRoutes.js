import express from "express";
import { studentDashboard , updateProfile} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {upload} from "../config/multer.js";
const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("student"),
  studentDashboard
);
router.put(
  "/profile",
  authMiddleware,
  authorize("student"),
  upload.single("profileImage"),
  updateProfile
);

export default router;
