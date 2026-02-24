import Student from "../models/Student.js";
import Manager from "../models/Manager.js";
import Admin from "../models/Admin.js";
import Team from "../models/Team.js";
import Task from "../models/Task.js";
import CompletedTask from "../models/CompletedTask.js";
import bcrypt from "bcryptjs";

export const managerDashboard = async (req, res) => {
  const students = await Student.find({
    createdBy: req.user.id,
  }).select("-password");
 

  res.json({
    message: "Manager dashboard data",
    totalStudents: students.length,
    students,
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

    const user = await Manager.findById(userId);

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

export const addStudent = async (req, res) => {
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
      console.log("running")
      return res.status(201).json({
        message: "Student registered successfully",
        user: student,
      });
  } catch (error) {
    res.status(500).json({ message: "Error in registering student"});
  }
};  
export const getStudents =  async (req, res) => {
  try {
    const students = await Student.find({ createdBy : req.user.id }).select("-password").populate("createdBy");
    if(students && students[0].createdBy){
      const manager = await Manager.findOne({_id : req.user.id})
    
      return res.json({students,manager});
    }
    res.json({students});
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
}
export const getStudent =  async (req, res) => {
  try {
    const {sId} = req.params
    console.log("running1 ")
    const student = await Student.findById( sId ).select("-password").populate("createdBy");
    console.log("running2 ")
    if(student && student.createdBy){
      const manager = await Manager.findById(req.user.id)
    
      return res.json({student,manager});
    }
    res.json({student});
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error });
  }
}
export const getAvailableStudents =  async (req, res) => {
  try {
    const students = await Student.find({ isAvailable : true }).select("-password").populate("createdBy");
   
    res.json({students});
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
}

export const getTeams = async (req,res) =>{
    const teams = await Team.find({teamLeader : req.user.id}).populate("createdBy").populate("teamLeader").populate("teamMembers")
    return res.status(200).json({
        success : true , 
        teams,
    })
}

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Verify that the student was created by the current manager
    if (student.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this student" });
    }

    // Remove student from all teams
    await Team.updateMany(
      { teamMembers: studentId },
      { $pull: { teamMembers: studentId } }
    );

    // Remove student from all pending tasks
    await Task.updateMany(
      { "assignedTo.student": studentId },
      { $pull: { assignedTo: { student: studentId } } }
    );

    // Delete tasks that have no students assigned after removal
    await Task.deleteMany({ assignedTo: { $size: 0 } });

    // Delete all completed tasks by this student
    await CompletedTask.deleteMany({ student: studentId });

    // Finally, delete the student
    await Student.findByIdAndDelete(studentId);

    res.json({ 
      success: true, 
      message: "Student and all associated data deleted successfully" 
    });

  } catch (error) {
    console.error("deleteStudent error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};