import { Class } from "../models/class.model.js";
import { Tutor } from "../models/tutor.model.js";
import { Student } from "../models/student.model.js";
import { User } from "../models/user.model.js";
import { sendTenantMail } from "../services/mail/mail.service.js";
import { MAIL_TYPES } from "../services/mail/mail.constant.js";

const dummyEmail = "voltix755@gmail.com";

// Create a new class (tenant only)
export const createClass = async (req, res) => {
  try {
    const {
      name,
      subject,
      tutorId,
      studentIds,
      schedule,
      description,
      platform,
      meetLink,
      reminderTime,
    } = req.body;

    const tenantId = req.user.tenantId;
    let validStudents = [];

    // ✅ Basic validation
    if (!name || !subject || !tutorId) {
      return res.status(400).json({
        message: "name, subject and tutorId are required",
      });
    }

    // ✅ Platform validation (important)
    if (platform === "google-meet" && !meetLink) {
      return res.status(400).json({
        message: "Meet link is required for Google Meet",
      });
    }

    // ✅ Verify tutor belongs to tenant
    const tutor = await Tutor.findOne({ _id: tutorId, tenantId });
    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found in your institute",
      });
    }

    // ✅ Verify students belong to tenant
    if (studentIds && studentIds.length > 0) {
      validStudents = await Student.find({
        _id: { $in: studentIds },
        tenantId,
      });

      if (validStudents.length !== studentIds.length) {
        return res.status(400).json({
          message: "One or more students not found in your institute",
        });
      }
    }

    // ✅ Clean schedule
    const parsedSchedule = {
      days:
        typeof schedule?.days === "string"
          ? schedule.days.trim()
          : "",
      time: schedule?.time || "",
    };

    // ✅ Create class with NEW fields
    const newClass = await Class.create({
      tenantId,
      name,
      subject,
      tutorId,
      studentIds: studentIds || [],
      schedule: parsedSchedule,
      description,

      // 🔥 NEW FIELDS
      platform: platform || "",
      meetLink: meetLink || "",
      reminderTime: reminderTime || 0,
    });

    console.log(parsedSchedule);

    // ✅ Send email to tutor
    const tutorUser = await User.findById(tutor.userId).select("name email");

    if (tutorUser) {
      await sendTenantMail(MAIL_TYPES.CLASS_ASSIGNED_TUTOR, {
        name: tutorUser.name,
        email: dummyEmail, // replace later
        className: newClass.name,
        subject: newClass.subject,
        scheduleDays: newClass.schedule?.days || "",
        scheduleTime: newClass.schedule?.time || "",
        meetLink: newClass.meetLink || "",
      });
    }

    // ✅ Send email to students
    if (validStudents.length > 0) {
      const studentUsers = await User.find({
        _id: { $in: validStudents.map((s) => s.userId) },
      }).select("name email");

      await Promise.all(
        studentUsers.map((studentUser) =>
          sendTenantMail(MAIL_TYPES.CLASS_ASSIGNED_STUDENT, {
            name: studentUser.name,
            email: dummyEmail, // replace later
            className: newClass.name,
            subject: newClass.subject,
            scheduleDays: newClass.schedule?.days || "",
            scheduleTime: newClass.schedule?.time || "",
            meetLink: newClass.meetLink || "",
          })
        )
      );
    }

    return res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("Create Class Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
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
    const { name, subject, tutorId, studentIds, schedule, status, description } = req.body;
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
    if (description !== undefined) classDoc.description = description;

    if (schedule !== undefined) {
      classDoc.schedule = {
        days:
          typeof schedule?.days === "string"
            ? schedule.days.trim()
            : classDoc.schedule.days,
        time: schedule?.time ?? classDoc.schedule.time,
      };
    }

    await classDoc.save();

    // Send update notification emails
    const tutor = await Tutor.findById(classDoc.tutorId);
    const tutorUser = await User.findById(tutor?.userId).select("name email");
    if (tutorUser) {
      await sendTenantMail(MAIL_TYPES.CLASS_ASSIGNED_TUTOR, {
        name: tutorUser.name,
        email: dummyEmail,
        className: classDoc.name,
        subject: classDoc.subject,
        scheduleDays: classDoc.schedule?.days || "",
        scheduleTime: classDoc.schedule?.time || "",
      });
    }

    if (classDoc.studentIds && classDoc.studentIds.length > 0) {
      const students = await Student.find({ _id: { $in: classDoc.studentIds } });
      const studentUsers = await User.find({
        _id: { $in: students.map((s) => s.userId) },
      }).select("name email");

      await Promise.all(
        studentUsers.map((studentUser) =>
          sendTenantMail(MAIL_TYPES.CLASS_ASSIGNED_STUDENT, {
            name: studentUser.name,
            email: dummyEmail,
            className: classDoc.name,
            subject: classDoc.subject,
            scheduleDays: classDoc.schedule?.days || "",
            scheduleTime: classDoc.schedule?.time || "",
          })
        )
      );
    }

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
