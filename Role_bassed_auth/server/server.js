import express from "express";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import managerRoutes from "./routes/managerRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import Cors from "cors";

import {connectDB} from './config/dbConnect.js';
dotenv.config();

const app = express();
app.use(Cors({
  origin: 
  "http://localhost:5173",
  credentials: true,
}));


const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/student", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


