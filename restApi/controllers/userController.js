import { User } from "../models/userModel.js"
import { v2 as cloudinary } from "cloudinary"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const registerUser = async (req, res) => {
  try {

    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    let imageUrl = "";

    if (req.file) {
    //   console.log("Uploading to cloudinary");
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        { resource_type: "image" }
      );
      imageUrl = uploadResult.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      passWord: hashedPassword,
      imageUrl,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRATE,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};



export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "user not found",
        });
    }


    const isMatch = await bcrypt.compare(password, user.passWord)
    if (!isMatch) {
        return res.json({ success: false, message: "invalid email or password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRATE, { expiresIn: '7d' })


    res.cookie('token', token, {
        httpOnly: true,//prevent js to access cookie
        secure: process.env.NODE_ENV === "production",  //use secure cookie in production
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // use for csrf protection
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ success: true, user: { email: user.email, name: user.name } })


}

export const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const getUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { userName, email } = req.body;

    const updateData = {};

    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updateData.imageUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: "-passWord" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};


export const userInfo = async (req, res) => {
    try {
        const userId = req.userId;
        // console.log("id", req.userId)
        const user = await User.findById(userId).select('-passWord');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Fetch user info error:", error);
        return res.status(500).json({ success: false, message: "error in fetching user details" });
    }
}
