import mongoose from "mongoose";
import { createDefaultAdmin } from "../utils/createAdmin.js";

export const connectDB = async () =>{
try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Drop old indexes that may be causing duplicate key errors
    try {
      const collection = mongoose.connection.collection("completedtasks");
      const indexInfo = await collection.indexInformation();
      
      // Drop the old 'task_1_student_1' index if it exists
      if (indexInfo["task_1_student_1"]) {
        await collection.dropIndex("task_1_student_1");
        console.log("Dropped old task_1_student_1 index from completedtasks");
      }
    } catch (indexError) {
      console.log("Index cleanup info:", indexError.message);
    }
    
    await createDefaultAdmin();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    
  }
}

