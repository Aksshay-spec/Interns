import CompletedTask from "../models/CompletedTask.js";
import Task from "../models/Task.js";


//MANAGER
// CREATE TASK (assign per student)
export const createTask = async (req, res) => {
  try {
    const { teamId, students, title, task } = req.body;

    const assignedStudents = students.map((id) => ({
      student: id,
      status: "pending",
      message: "",
      remark: "",
      submittedAt: null,
      approvedAt: null,
      history: [], 
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
// MANAGER GET ALL ACTIVE TASKS
export const getManagerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .populate("team", "teamName")
      .populate("assignedTo.student", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks });
  } catch (err) {
    console.error("getManagerTasks error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// MANAGER REVIEW STUDENT TASK
export const reviewTask = async (req, res) => {
  try {
    const { studentId, status, remark } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const studentTaskIndex = task.assignedTo.findIndex(
      (s) => s.student.toString() === studentId
    );

    if (studentTaskIndex === -1)
      return res.status(404).json({ message: "Student not assigned to task" });

    const studentTask = task.assignedTo[studentTaskIndex];


    if (status === "approved") {
      const approvedTime = new Date();

      await CompletedTask.create({
        team: task.team,
        student: studentTask.student,
        title: task.title,
        description: task.description,
        createdBy: task.createdBy,
        submittedAt: studentTask.submittedAt || approvedTime,
        approvedAt: approvedTime,
        history: studentTask.history || [],
      });

      // remove approved student from active task
      task.assignedTo.splice(studentTaskIndex, 1);
    }
    else if (status === "retask") {
      studentTask.status = "retask";
      studentTask.remark = remark || "";
      studentTask.message = "";
      studentTask.submittedAt = null;

 
      studentTask.history.push({
        sender: "manager",
        text: remark || "",
        date: new Date(),
      });
    }

    else {
      studentTask.status = status;
      if (remark !== undefined) studentTask.remark = remark;
    }

    if (task.assignedTo.length === 0) {
      await Task.findByIdAndDelete(task._id);
      return res.json({
        success: true,
        message: "All students approved, task moved to history",
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
    res.status(500).json({ message: "Server error" });
  }
};


//STUDENT
// STUDENT GET TASKS
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
    studentTask.message = message || "";
    studentTask.remark = "";
    studentTask.submittedAt = new Date();

    studentTask.history.push({
      sender: "student",
      text: message || "",
      date: new Date(),
    });

    await task.save();

    res.json({ success: true, message: "Task submitted", task });

  } catch (err) {
    console.error("submitTask error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//HISTORY
export const getAllCompletedTasks = async (req, res) => {
  try {
    const completedTasks = await CompletedTask.find({
      createdBy: req.user.id,
    })
      .populate("team", "teamName")
      .populate("student", "name email")
      .populate("createdBy", "name email") // 🆕 needed for popup
      .sort({ approvedAt: -1 });

    res.json({ success: true, completedTasks });

  } catch (error) {
    console.error("getAllCompletedTasks error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const singleDeleteCompletedTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await CompletedTask.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await CompletedTask.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const bulkDeleteCompletedTasks = async (req, res) => {
  try {
    const { taskIds } = req.body;

    console.log("Bulk delete IDs:", taskIds);
    if (!taskIds || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No task IDs provided",
      });
    }


    await CompletedTask.deleteMany({
      _id: { $in: taskIds },
    });

    res.status(200).json({
      success: true,
      message: "Selected tasks deleted successfully",
    });

  } catch (error) {
    console.error("Bulk Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};