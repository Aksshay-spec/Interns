import express from "express";
import {config} from "dotenv";
import { dbConnect } from "./configs/dbConnect.js";
import cors from "cors";


import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import studentRoutes from "./routes/student.routes.js"
import classRoutes from "./routes/class.routes.js"

config();
dbConnect();


const app = express();
app.use(cors({
    origin : "http://localhost:5173"

}))
app.use("/uploads", express.static("uploads"));




const Port = process.env.PORT || 4000

app.get('/',(req,res)=>{
    res.end("Hello")
})

app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/class", classRoutes);

app.listen(Port , ()=>{
    console.log(`Server is running on port ${Port}`)
})