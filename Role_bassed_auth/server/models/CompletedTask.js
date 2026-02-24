import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["student", "manager"],
  },
  text: String,
  date: Date,
});

const completedTaskSchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Manager", required: true },

    submittedAt: Date,
    approvedAt: Date,

  
    history: [historySchema],
  },
  { timestamps: true }
);

export default mongoose.model("CompletedTask", completedTaskSchema);
