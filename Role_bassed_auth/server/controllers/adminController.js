import bcrypt from "bcryptjs";
import Manager from "../models/Manager.js";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import Team from "../models/Team.js";
import Task from "../models/Task.js";
import CompletedTask from "../models/CompletedTask.js";



export const addmanager = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log("Register User - Request Body:", req.body);

    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const adminExists = await Admin.findOne({ email });
    const managerExists = await Manager.findOne({ email });
    const studentExists = await Student.findOne({ email });

    if (adminExists || managerExists || studentExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      const manager = await Manager.create({
        name,
        email,
        password: hashedPassword,
        createdBy: req.user.id,
      });
  

      return res.status(201).json({
        message: "Manager registered successfully",
        user: manager,
      });
  } catch (error) {
    res.status(500).json({ message: "Error in registering manager" });
  }
};
export const addstudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log("Register User - Request Body:", req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const adminExists = await Admin.findOne({ email });
    const managerExists = await Manager.findOne({ email });
    const studentExists = await Student.findOne({ email });

    if (adminExists || managerExists || studentExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      const student = await Student.create({
        name,
        email,
        password: hashedPassword,
        createdBy: req.user.id,
      });
      return res.status(201).json({
        message: "Student registered successfully",
        user: student,
      });
  } catch (error) {
    res.status(500).json({ message: "Error in registering student"});
  }
};

export const adminDashboard = async (req, res) => {
  const managersCount = await Manager.countDocuments();
  const studentsCount = await Student.countDocuments();

  

  res.json({
    message: "Admin dashboard data",
    stats: {
      managers: managersCount,
      students: studentsCount,
    },
   
  });
};



export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await Admin.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password required" });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    
    if (name) user.name = name;
    if (email) user.email = email;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};

export const getManagers =  async (req, res) => {
  try {
    const managers = await Manager.find({ createdBy: req.user.id }).select("-password").populate("createdBy");
     if(managers && managers[0].createdBy){
      const admin = await Admin.findOne({_id : req.user.id})
      return res.json({managers , admin})
    }
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching managers", error });
  }
}

export const getStudents =  async (req, res) => {
  try {
    const students = await Student.find({}).select("-password").lean();
    const admin = await Admin.findOne({ _id: req.user.id });

    const creatorIds = Array.from(
      new Set(
        students
          .map((student) => (student.createdBy ? student.createdBy.toString() : null))
          .filter(Boolean),
      ),
    );

    const [admins, managers] = await Promise.all([
      Admin.find({ _id: { $in: creatorIds } }).select("name").lean(),
      Manager.find({ _id: { $in: creatorIds } }).select("name").lean(),
    ]);

    const adminMap = new Map(admins.map((item) => [item._id.toString(), item.name]));
    const managerMap = new Map(
      managers.map((item) => [item._id.toString(), item.name]),
    );

    const studentsWithCreator = students.map((student) => {
      const creatorId = student.createdBy ? student.createdBy.toString() : "";
      let createdByName = "";
      let createdByRole = "";

      if (creatorId && adminMap.has(creatorId)) {
        createdByName = adminMap.get(creatorId);
        createdByRole = "admin";
      } else if (creatorId && managerMap.has(creatorId)) {
        createdByName = managerMap.get(creatorId);
        createdByRole = "manager";
      }

      return {
        ...student,
        createdByName,
        createdByRole,
      };
    });

    res.json({ students: studentsWithCreator, admin });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
}

export const deleteStudentAdmin = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await Team.updateMany(
      { teamMembers: studentId },
      { $pull: { teamMembers: studentId } }
    );

    await Task.updateMany(
      { "assignedTo.student": studentId },
      { $pull: { assignedTo: { student: studentId } } }
    );

    await Task.deleteMany({ assignedTo: { $size: 0 } });

    await CompletedTask.deleteMany({ student: studentId });

    await Student.findByIdAndDelete(studentId);

    res.json({
      success: true,
      message: "Student and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("deleteStudentAdmin error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteManagerAdmin = async (req, res) => {
  try {
    const { managerId } = req.params;

    const manager = await Manager.findById(managerId);

    if (!manager) {
      return res.status(404).json({ success: false, message: "Manager not found" });
    }

    const teams = await Team.find({ teamLeader: managerId });
    const teamIds = teams.map((team) => team._id);

    if (teams.length > 0) {
      const memberIds = teams.flatMap((team) => team.teamMembers || []);

      if (memberIds.length > 0) {
        await Student.updateMany(
          { _id: { $in: memberIds } },
          { $set: { isAvailable: true } }
        );
      }

      await Task.deleteMany({ team: { $in: teamIds } });
      await CompletedTask.deleteMany({ team: { $in: teamIds } });
      await Team.deleteMany({ _id: { $in: teamIds } });
    }

    await Manager.findByIdAndDelete(managerId);

    res.json({ success: true, message: "Manager deleted successfully" });
  } catch (error) {
    console.error("deleteManagerAdmin error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteTeamAdmin = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.teamMembers && team.teamMembers.length > 0) {
      await Student.updateMany(
        { _id: { $in: team.teamMembers } },
        { $set: { isAvailable: true } }
      );
    }

    await Team.findByIdAndDelete(teamId);

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("deleteTeamAdmin error:", error);
    return res.status(500).json({
      message: "Server error while deleting team",
    });
  }
};