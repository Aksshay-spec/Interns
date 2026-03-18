import express from "express";
import { createMeetLink } from "../controllers/meet.controller.js"

const router = express.Router();

// POST /api/meet/create
router.post("/create", createMeetLink);

export default router;