import express from "express";
import { managerDashboard , updateProfile , addStudent , getStudents , getTeams , getAvailableStudents , getStudent, deleteStudent } from "../controllers/managerController.js";
import {addTeamMembers, deleteTeam, removeTeamMember} from "../controllers/teamController.js"
import {createTask , getAllCompletedTasks, getManagerTasks , reviewTask, deleteCompletedTask, bulkDeleteCompletedTasks} from "../controllers/taskController.js"
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

router.post("/addstudent",
  authMiddleware,
  authorize("manager"),
  addStudent
)

router.get("/students", authMiddleware, authorize("manager"),getStudents);
router.get("/student/:sId", authMiddleware, authorize("manager"),getStudent);
router.delete("/student/:studentId", authMiddleware, authorize("manager"), deleteStudent);
router.get("/teams", authMiddleware, authorize("manager"),getTeams);
router.get("/available-students", authMiddleware, authorize("manager"),getAvailableStudents);

router.delete(
  "/team/:teamId",
  authMiddleware,
  authorize("manager"),
  deleteTeam
);

// POST /api/manager/:teamId/addmembers
router.post(
  "/:teamId/addmembers",
  authMiddleware,
  authorize("manager"),
  addTeamMembers
);

// DELETE /api/manager/:teamId/members/:studentId
router.delete(
  "/:teamId/members/:studentId",
  authMiddleware,
  authorize("manager"),
  removeTeamMember
);


//Post /api/manager/addtask
router.post(
  "/addtask",
  authMiddleware,
  authorize("manager"),
  createTask
);
//Get /api/manager/task
router.get(
  "/task",
  authMiddleware,
  authorize("manager"),
  getManagerTasks
);
// PATCH /api/manager/task/review/:taskId
router.patch(
  "/task/review/:taskId",
  authMiddleware,
  authorize("manager"),
  reviewTask
);

//Get /api/manager/task/completed-tasks
router.get(
  "/task/completed-tasks",
  authMiddleware,
  authorize("manager"),
  getAllCompletedTasks
);

// DELETE /api/manager/task/completed-tasks/:taskId
router.delete(
  "/task/completed-tasks/:taskId",
  authMiddleware,
  authorize("manager"),
  deleteCompletedTask
);

// POST /api/manager/task/completed-tasks/bulk-delete
router.post(
  "/task/completed-tasks/bulk-delete",
  authMiddleware,
  authorize("manager"),
  bulkDeleteCompletedTasks
);

export default router;
