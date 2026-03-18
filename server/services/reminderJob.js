import cron from "node-cron";
import { Class } from "../models/class.model.js";
import { User } from "../models/user.model.js";
import { sendTenantMail} from "../services/mail/mail.service.js";
import {MAIL_TYPES} from "../services/mail/mail.constant.js"
import {getClassStartDateTime} from "../utils/classHelper.js"



cron.schedule("* * * * *", async () => {
  try {
    console.log(" Running reminder job...");

    const now = new Date();

    // Get only active classes where reminder not sent
    const classes = await Class.find({
      status: "active",
      reminderSent: false,
    }).populate("studentIds tutorId");

    for (const cls of classes) {
      const classStart = getClassStartDateTime(
        cls.schedule?.days,
        cls.schedule?.time
      );

      if (!classStart) continue;

      const reminderMinutes = cls.reminderTime || 30;

      // Calculate reminder trigger time
      const reminderTime = new Date(
        classStart.getTime() - reminderMinutes * 60000
      );

      // Check if it's time to send reminder
      if (now >= reminderTime && now < classStart) {
        console.log(` Sending reminder for class: ${cls.name}`);

       
        if (cls.studentIds?.length > 0) {
          const studentUsers = await User.find({
            _id: { $in: cls.studentIds.map((s) => s.userId) },
          }).select("name email");

          await Promise.all(
            studentUsers.map((student) =>
              sendTenantMail(MAIL_TYPES.CLASS_REMINDER_STUDENT, {
                name: student.name,
                email: student.email,
                className: cls.name,
                subject: cls.subject,
                scheduleDays: cls.schedule?.days,
                scheduleTime: cls.schedule?.time,
                meetLink: cls.meetLink,
              })
            )
          );
        }

        
        if (cls.tutorId) {
          const tutorUser = await User.findById(cls.tutorId.userId).select(
            "name email"
          );

          if (tutorUser) {
            await sendTenantMail(MAIL_TYPES.CLASS_REMINDER_TUTOR, {
              name: tutorUser.name,
              email: tutorUser.email,
              className: cls.name,
              subject: cls.subject,
              scheduleDays: cls.schedule?.days,
              scheduleTime: cls.schedule?.time,
              meetLink: cls.meetLink,
            });
          }
        }

        
        cls.reminderSent = true;
        await cls.save();
      }
    }
  } catch (error) {
    console.error("Reminder Job Error:", error);
  }
});