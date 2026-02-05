import express from "express";
import { managerDashboard , updateProfile } from "../controllers/managerController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {upload} from "../config/multer.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("manager"),
  managerDashboard
);
router.put(
  "/profile",
  authMiddleware,
  authorize("manager"),
  upload.single("profileImage"),
  updateProfile
);


export default router;
