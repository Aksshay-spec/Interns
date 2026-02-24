import express from "express";
import {  addmanager , addstudent , adminDashboard , updateProfile , getManagers , getStudents , deleteManagerByAdmin , deleteStudentByAdmin , deleteTeam } from "../controllers/adminController.js";
import { authMiddleware  } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import {upload} from "../config/multer.js";
import { addTeam , getTeams } from "../controllers/teamController.js";


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

router.post(
  "/addteam",
  authMiddleware,
  authorize("admin"),
  addTeam
)
router.get(
  "/teams",
  authMiddleware,
  authorize("admin"),
  getTeams
)

// Admin dashboard
router.get(
  "/dashboard",
  authMiddleware,
  authorize("admin"),
  adminDashboard
);

router.get("/managers", authMiddleware, authorize("admin"),getManagers);
router.get("/students", authMiddleware, authorize("admin"),getStudents);

router.delete(
  "/manager/:managerId",
  authMiddleware,
  authorize("admin"),
  deleteManagerByAdmin
);

router.delete(
  "/student/:studentId",
  authMiddleware,
  authorize("admin"),
  deleteStudentByAdmin
);
router.delete("/teams/:teamId", authMiddleware, authorize("admin"), deleteTeam);
export default router;
