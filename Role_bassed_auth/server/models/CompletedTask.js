import mongoose from "mongoose";

const completedTaskSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

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
  },
  { timestamps: true }
);

// Add unique compound index for student + team + title
completedTaskSchema.index({ student: 1, team: 1, title: 1 }, { unique: true });

export default mongoose.model("CompletedTask", completedTaskSchema);
