import mongoose from "mongoose";


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

  message: {
    type: String,
    default: "",
  },

  remark: {
    type: String,
    default: "",
  },

  conversation: {
    type: [
      {
        sender: {
          type: String,
          enum: ["student", "manager"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },

  submittedAt: {
    type: Date,
    default: null,
  },

  approvedAt: {
    type: Date,
    default: null,
  },
});


const taskSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    assignedTo: [assignedStudentSchema],

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager", 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
