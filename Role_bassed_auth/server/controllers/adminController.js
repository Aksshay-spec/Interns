import bcrypt from "bcryptjs";
import Manager from "../models/Manager.js";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import Task from "../models/Task.js";
import CompletedTask from "../models/CompletedTask.js";
import Team from "../models/Team.js";



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

export const getStudents = async (req, res) => {
  try {
    // 1️⃣ Get students (exclude password)
    const students = await Student.find().select("-password");

    if (!students.length) {
      return res.status(200).json({ students: [] });
    }

    // 2️⃣ Collect all createdBy IDs
    const creatorIds = students
      .map((s) => s.createdBy)
      .filter(Boolean);

    // 3️⃣ Find matching admins
    const admins = await Admin.find({
      _id: { $in: creatorIds },
    }).select("name email role");

    // 4️⃣ Find matching managers
    const managers = await Manager.find({
      _id: { $in: creatorIds },
    }).select("name email role");

    // 5️⃣ Combine both into one map
    const creatorMap = {};

    admins.forEach((admin) => {
      creatorMap[admin._id.toString()] = admin;
    });

    managers.forEach((manager) => {
      creatorMap[manager._id.toString()] = manager;
    });

    // 6️⃣ Attach correct creator to each student
    const formattedStudents = students.map((student) => {
      const studentObj = student.toObject();
      studentObj.createdBy =
        creatorMap[student.createdBy?.toString()] || null;
      return studentObj;
    });

    return res.status(200).json({ students: formattedStudents });

  } catch (error) {
    console.error("getStudents error:", error);
    return res.status(500).json({
      message: "Error fetching students",
    });
  }
};

export const deleteManagerByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { managerId } = req.params;

    
    const manager = await Manager.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

   
    if (manager.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this manager",
      });
    }

 
    await Task.deleteMany({ createdBy: managerId });

  
    await CompletedTask.deleteMany({ createdBy: managerId });

   
    await Team.updateMany(
      { teamLeader: managerId },
      { $unset: { teamLeader: "" } }
    );

  
    await Manager.findByIdAndDelete(managerId);

    return res.status(200).json({
      message: "Manager deleted successfully",
    });

  } catch (error) {
    console.error("deleteManagerByAdmin error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStudentByAdmin = async (req, res) => {
  try {
    const { studentId } = req.params;

 
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Team.updateMany(
      { teamMembers: studentId },
      { $pull: { teamMembers: studentId } }
    );

  
    await Task.updateMany(
      { "assignedTo.student": studentId },
      { $pull: { assignedTo: { student: studentId } } }
    );

   
    await CompletedTask.deleteMany({ student: studentId });

 
    await Student.findByIdAndDelete(studentId);

    return res.status(200).json({
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.error("deleteStudentByAdmin error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteTeam = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (team.createdBy.toString() !== adminId.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this team",
      });
    }

  
    await Task.deleteMany({ team: teamId });

     
    await CompletedTask.deleteMany({ team: teamId });

   
    await Team.findByIdAndDelete(teamId);

    return res.status(200).json({
      message: "Team and related tasks deleted successfully",
    });

  } catch (error) {
    console.error("deleteTeam error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};