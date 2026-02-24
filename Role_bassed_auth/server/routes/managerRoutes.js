import express from "express";
import { managerDashboard , updateProfile , addStudent , getStudents , getTeams , getAvailableStudents , getStudent , deleteStudent } from "../controllers/managerController.js";
import {addTeamMembers , removeMultipleTeamMembers , removeTeam} from "../controllers/teamController.js"
import {createTask , getAllCompletedTasks, getManagerTasks , reviewTask , singleDeleteCompletedTask , bulkDeleteCompletedTasks} from "../controllers/taskController.js"
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
router.get("/teams", authMiddleware, authorize("manager"),getTeams);
router.get("/available-students", authMiddleware, authorize("manager"),getAvailableStudents);

// POST /api/manager/:teamId/addmembers
router.post(
  "/:teamId/addmembers",
  authMiddleware,
  authorize("manager"),
  addTeamMembers
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
router.patch("/teams/:teamId/remove-members",authMiddleware,
  authorize("manager"), removeMultipleTeamMembers);

router.delete("/teams/:teamId/delete", authMiddleware, authorize("manager"), removeTeam);

// Delete single
router.delete("/task/completed-tasks/:id", authMiddleware, authorize("manager") ,  singleDeleteCompletedTask);

// Bulk delete
router.delete("/task/completed-tasks/bulk/delete", authMiddleware, authorize("manager"), bulkDeleteCompletedTasks);

router.delete("/student/:studentId", authMiddleware, authorize("manager"), deleteStudent);

export default router;
