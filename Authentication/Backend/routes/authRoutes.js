const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

const upload = require("../config/upload");


const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);


router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, upload.single("profileImage"), updateProfile);

module.exports = router;
