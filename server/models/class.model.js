import mongoose from "mongoose";

const { Schema, model } = mongoose;

const classSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },
    studentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    schedule: {
      days: {
        type: String,
        required: true,
      },
      time: String,
    },
    platform: {
      type: String,
      enum: ["google-meet", "youtube", ""],
      default: "",
    },
    meetLink: {
      type: String,
      default: "",
    },
    reminderTime: {
      type: Number, // minutes
      default: 30,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Class = model("Class", classSchema);