import express from "express";
import {config} from "dotenv";
import { dbConnect } from "./configs/dbConnect.js";
import cors from "cors";


import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";

config();
dbConnect();

const app = express();
app.use(cors({
    origin : "http://localhost:5173"

}))


const Port = process.env.PORT || 4000

app.get('/',(req,res)=>{
    res.end("Hello")
})

app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.listen(Port , ()=>{
    console.log(`Server is running on port ${Port}`)
})