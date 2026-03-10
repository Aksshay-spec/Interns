import { Class } from "../models/class.model.js";
import { Tutor } from "../models/tutor.model.js";
import { Student } from "../models/student.model.js";
import { User } from "../models/user.model.js";

// Create a new class (tenant only)
export const createClass = async (req, res) => {
  try {
    const { name, subject, tutorId, studentIds, schedule } = req.body;
    const tenantId = req.user.tenantId;

    if (!name || !subject || !tutorId) {
      return res.status(400).json({
        message: "name, subject and tutorId are required",
      });
    }

    // Verify tutor belongs to this tenant
    const tutor = await Tutor.findOne({ _id: tutorId, tenantId });
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found in your institute" });
    }

    // Verify all students belong to this tenant
    if (studentIds && studentIds.length > 0) {
      const validStudents = await Student.find({
        _id: { $in: studentIds },
        tenantId,
      });
      if (validStudents.length !== studentIds.length) {
        return res.status(400).json({
          message: "One or more students not found in your institute",
        });
      }
    }

    const parsedSchedule = {
      days: Array.isArray(schedule?.days)
        ? schedule.days
        : typeof schedule?.days === "string"
          ? schedule.days.split(",").map((d) => d.trim()).filter(Boolean)
          : [],
      time: schedule?.time || "",
    };

    const newClass = await Class.create({
      tenantId,
      name,
      subject,
      tutorId,
      studentIds: studentIds || [],
      schedule: parsedSchedule,
    });

    return res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("Create Class Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get all classes for a tenant
export const getClassesByTenant = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const classes = await Class.find({ tenantId })
      .populate({
        path: "tutorId",
        populate: { path: "userId", select: "name email" },
      })
      .populate({
        path: "studentIds",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Classes fetched successfully",
      classes,
    });
  } catch (error) {
    console.error("Get Classes Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update a class
export const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { name, subject, tutorId, studentIds, schedule, status } = req.body;
    const tenantId = req.user.tenantId;

    const classDoc = await Class.findOne({ _id: classId, tenantId });
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Verify tutor if changing
    if (tutorId) {
      const tutor = await Tutor.findOne({ _id: tutorId, tenantId });
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found in your institute" });
      }
      classDoc.tutorId = tutorId;
    }

    // Verify students if changing
    if (studentIds !== undefined) {
      if (studentIds.length > 0) {
        const validStudents = await Student.find({
          _id: { $in: studentIds },
          tenantId,
        });
        if (validStudents.length !== studentIds.length) {
          return res.status(400).json({
            message: "One or more students not found in your institute",
          });
        }
      }
      classDoc.studentIds = studentIds;
    }

    if (name !== undefined) classDoc.name = name;
    if (subject !== undefined) classDoc.subject = subject;
    if (status !== undefined) classDoc.status = status;

    if (schedule !== undefined) {
      classDoc.schedule = {
        days: Array.isArray(schedule?.days)
          ? schedule.days
          : typeof schedule?.days === "string"
            ? schedule.days.split(",").map((d) => d.trim()).filter(Boolean)
            : classDoc.schedule.days,
        time: schedule?.time ?? classDoc.schedule.time,
      };
    }

    await classDoc.save();

    return res.status(200).json({
      message: "Class updated successfully",
      class: classDoc,
    });
  } catch (error) {
    console.error("Update Class Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete a class
export const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const tenantId = req.user.tenantId;

    const classDoc = await Class.findOneAndDelete({ _id: classId, tenantId });
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.status(200).json({
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Delete Class Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get classes for a specific tutor
export const getClassesByTutor = async (req, res) => {
  try {
    const userId = req.user.id;
    const tenantId = req.user.tenantId;

    const tutorProfile = await Tutor.findOne({ userId });
    if (!tutorProfile) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }

    const classes = await Class.find({ tutorId: tutorProfile._id, tenantId })
      .populate({
        path: "studentIds",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Classes fetched successfully",
      classes,
    });
  } catch (error) {
    console.error("Get Tutor Classes Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get classes for a specific student
export const getClassesByStudent = async (req, res) => {
  try {
    const userId = req.user.id;
    const tenantId = req.user.tenantId;

    const studentProfile = await Student.findOne({ userId });
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const classes = await Class.find({
      studentIds: studentProfile._id,
      tenantId,
    })
      .populate({
        path: "tutorId",
        populate: { path: "userId", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Classes fetched successfully",
      classes,
    });
  } catch (error) {
    console.error("Get Student Classes Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
