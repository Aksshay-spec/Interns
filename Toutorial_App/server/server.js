import express from "express";
import { config } from "dotenv";
import { dbConnect } from "./configs/dbConnect.js";
import cors from "cors";
import http from "http";

import { initSocket } from "./configs/socketManager.js";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import tutorRoutes from "./routes/tutor.routes.js";
import studentRoutes from "./routes/student.routes.js";

config();
dbConnect();

const app = express();

/* Middleware */

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

/* Routes */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

/* Create HTTP server */

const server = http.createServer(app);

/* Initialize socket */

initSocket(server);

/* Start server */

const Port = process.env.PORT || 4000;

server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});