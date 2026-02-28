import express from "express";
import { registerTenant, loginUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";



const router = express.Router();


// Tenant self registration (goes for approval)
router.post("/register", registerTenant);

// Login (superadmin, tenant, tutor, student)
router.post("/login",loginUser);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User fetched successfully",
    user: req.user,
  });
});

export default router;
