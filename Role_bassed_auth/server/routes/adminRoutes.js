import express from "express";
import {  addmanager , addstudent , adminDashboard , updateProfile , getManagers , getStudents, deleteStudentAdmin, deleteManagerAdmin, deleteTeamAdmin} from "../controllers/adminController.js";
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
router.delete("/student/:studentId", authMiddleware, authorize("admin"), deleteStudentAdmin);
router.delete("/manager/:managerId", authMiddleware, authorize("admin"), deleteManagerAdmin);
router.delete("/team/:teamId", authMiddleware, authorize("admin"), deleteTeamAdmin);

export default router;
