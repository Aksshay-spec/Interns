import mongoose from "mongoose";

/* ===== Conversation History Schema ===== */
const historySchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["student", "manager"],
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

/* ===== Assigned Student ===== */
const assignedStudentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "incompleted", "approved", "retask"],
    default: "pending",
  },

  message: { type: String, default: "" },
  remark: { type: String, default: "" },

  submittedAt: { type: Date, default: null },
  approvedAt: { type: Date, default: null },


  history: [historySchema],
});

/* ===== Task ===== */
const taskSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    assignedTo: [assignedStudentSchema],

    title: { type: String, required: true },
    description: { type: String, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
