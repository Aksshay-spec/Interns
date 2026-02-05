import mongoose from "mongoose";
import { createDefaultAdmin } from "../utils/createAdmin.js";

export const connectDB = async () =>{
try {
    await mongoose.connect(process.env.MONGODB_URI);
    await createDefaultAdmin();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    
  }
}

