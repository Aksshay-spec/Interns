import express from "express";
import { registerUser , loginUser , getUsers , updateProfile , userInfo, logoutUser} from "../controllers/userController.js";
import { upload } from "../config/multer.js";
import {authUser} from "../middlewares/authUser.js"
const router = express.Router();

router.post("/register",upload.single("profile-image"),registerUser);
router.post("/login",loginUser);
router.get("/logout",authUser,logoutUser);

router.get("/users",getUsers);

router.post("/update-profile/",authUser,upload.single("profile-image"),updateProfile)
router.get("/me",authUser,userInfo);


export default router;