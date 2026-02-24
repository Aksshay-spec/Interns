import CompletedTask from "../models/CompletedTask.js";
import Task from "../models/Task.js";


// CREATE TASK (assign per student)
export const createTask = async (req, res) => {
  try {
    const { teamId, students, title, task } = req.body;

    const assignedStudents = students.map((id) => ({
      student: id,
      status: "pending",
      message: "",
      remark: "",
      conversation: [],
      submittedAt: null,
      approvedAt: null,
    }));

    const newTask = await Task.create({
      team: teamId,
      assignedTo: assignedStudents,
      title,
      description: task,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// MANAGER GET ALL TASKS
export const getManagerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .populate("team", "teamName teamLeader")
      .populate("team.teamLeader", "name")
      .populate("assignedTo.student", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (err) {
    console.error("getManagerTasks error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// MANAGER REVIEW SPECIFIC STUDENT
export const reviewTask = async (req, res) => {
  try {
    const { studentId, status, remark } = req.body;

    console.log("reviewTask called with:", { taskId: req.params.taskId, studentId, status, remark });

    const task = await Task.findById(req.params.taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const studentTaskIndex = task.assignedTo.findIndex(
      (s) => s.student.toString() === studentId
    );

    if (studentTaskIndex === -1)
      return res.status(404).json({ message: "Student not assigned to task" });

    const studentTask = task.assignedTo[studentTaskIndex];

    if (!Array.isArray(studentTask.conversation)) {
      studentTask.conversation = [];
    }

    // update remark + status
    studentTask.status = status;
    studentTask.remark = remark || "";

    if (remark) {
      studentTask.conversation.push({
        sender: "manager",
        text: remark,
        createdAt: new Date(),
      });
    }

    /* ================= APPROVE ================= */
    if (status === "approved") {
      studentTask.approvedAt = new Date();

      try {
        // Use findOneAndUpdate with upsert to handle duplicates gracefully
        await CompletedTask.findOneAndUpdate(
          {
            student: studentTask.student,
            team: task.team,
            title: task.title,
          },
          {
            team: task.team,
            student: studentTask.student,
            title: task.title,
            description: task.description,
            createdBy: task.createdBy,
            message: studentTask.message,
            remark: studentTask.remark,
            conversation: studentTask.conversation,
            submittedAt: studentTask.submittedAt,
            approvedAt: studentTask.approvedAt,
          },
          { upsert: true, new: true }
        );
        console.log("CompletedTask created/updated for student:", studentTask.student);
      } catch (createError) {
        console.error("Error creating/updating CompletedTask:", createError);
        throw createError;
      }

      // remove only approved student from task
      task.assignedTo.splice(studentTaskIndex, 1);
    }

    /* ================= RETASK ================= */
    else if (status === "retask") {
      studentTask.status = "retask";
    }

    // if no students left → delete task
    if (task.assignedTo.length === 0) {
      await Task.findByIdAndDelete(task._id);
      return res.json({
        success: true,
        message: "All students approved, task closed",
      });
    }

    await task.save();

    res.json({
      success: true,
      message: "Student task reviewed",
      task,
    });

  } catch (err) {
    console.error("reviewTask error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/* =========================================================
   STUDENT SIDE
========================================================= */

// STUDENT GET TASKS (only his tasks)
export const getStudentTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: { $elemMatch: { student: req.user.id } },
    })
      .populate("team", "teamName")
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });

  } catch (err) {
    console.error("getStudentTasks error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET SINGLE TASK
export const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("team", "teamName")
      .populate("assignedTo.student", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ success: true, task });

  } catch (err) {
    console.error("getSingleTask error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// STUDENT SUBMIT TASK
export const submitTask = async (req, res) => {
  try {
    const { status, message } = req.body;
    const studentId = req.user.id;

    const task = await Task.findById(req.params.taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const studentTask = task.assignedTo.find(
      (s) => s.student.toString() === studentId
    );

    if (!studentTask)
      return res.status(403).json({ message: "You are not assigned to this task" });

    studentTask.status = status; 
    studentTask.message = message;
    studentTask.submittedAt = new Date();

    if (!Array.isArray(studentTask.conversation)) {
      studentTask.conversation = [];
    }

    if (message) {
      studentTask.conversation.push({
        sender: "student",
        text: message,
        createdAt: new Date(),
      });
    }

    await task.save();

    res.json({ success: true, message: "Task submitted", task });

  } catch (err) {
    console.error("submitTask error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* =========================================================
   COMPLETED TASKS
========================================================= */

export const getAllCompletedTasks = async (req, res) => {
  try {
    const completedTasks = await CompletedTask.find()
      .populate("team", "teamName")
      .populate("student", "name email")
      .populate("createdBy", "name email")
      .sort({ approvedAt: -1 });

    res.json({ success: true, completedTasks });

  } catch (error) {
    console.error("getAllCompletedTasks error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// DELETE SINGLE COMPLETED TASK
export const deleteCompletedTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await CompletedTask.findById(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Verify that the task was created by the current manager
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this task" });
    }

    await CompletedTask.findByIdAndDelete(taskId);

    res.json({ success: true, message: "Task deleted successfully" });

  } catch (error) {
    console.error("deleteCompletedTask error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// BULK DELETE COMPLETED TASKS
export const bulkDeleteCompletedTasks = async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ success: false, message: "No tasks selected" });
    }

    // Verify all tasks belong to the current manager
    const tasks = await CompletedTask.find({ _id: { $in: taskIds } });

    const unauthorizedTasks = tasks.filter(
      (task) => task.createdBy.toString() !== req.user.id
    );

    if (unauthorizedTasks.length > 0) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized to delete some tasks" 
      });
    }

    const result = await CompletedTask.deleteMany({ 
      _id: { $in: taskIds },
      createdBy: req.user.id 
    });

    res.json({ 
      success: true, 
      message: `${result.deletedCount} tasks deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error("bulkDeleteCompletedTasks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
