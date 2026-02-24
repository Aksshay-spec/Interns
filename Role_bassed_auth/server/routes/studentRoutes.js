import express from "express";
import { studentDashboard , updateProfile} from "../controllers/studentController.js";
import { getStudentTasks , getSingleTask , submitTask } from "../controllers/taskController.js";
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

router.get("/tasks", authMiddleware,authorize("student"), getStudentTasks);
router.get("/task/:taskId", authMiddleware, authorize("student"), getSingleTask);
router.patch("/task/:taskId", authMiddleware, authorize("student"), submitTask);
export default router;
