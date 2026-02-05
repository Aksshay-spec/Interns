import express from "express";
import {  addmanager , addstudent , adminDashboard , updateProfile} from "../controllers/adminController.js";
import { authMiddleware  } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {upload} from "../config/multer.js";


const router = express.Router();


router.post(
  "/addmanager",
  authMiddleware,
  authorize("admin"),
  addmanager
);
router.post(
  "/addstudent",
  authMiddleware,
  authorize("admin"),
  addstudent
);

router.put(
  "/profile",
  authMiddleware,
  authorize("admin"),
  upload.single("profileImage"),
  updateProfile
);

// Admin dashboard
router.get(
  "/dashboard",
  authMiddleware,
  authorize("admin"),
  adminDashboard
);

export default router;
