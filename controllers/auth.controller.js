import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import { generateTokens } from "../utils/generateToken.util.js";

// Normal User Registration
export const register = async (req, res) => {
  try {
    const { channelName, phone, password, email, role } = req.body;

    if (!channelName || !email || !password || !phone || !req.files?.logo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including channel logo.",
      });
    }

    // Admin/Super Admin check
    let userRole = "user"; 
    if (role === "admin" || role === "superadmin") {
      const userRoleFromToken = req.user?.role; 
      if (userRoleFromToken !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Only super admins can create admins or super admins.",
        });
      }
      userRole = role;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadedLogo = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath,
      { folder: "logos" }
    );

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName,
      phone,
      email,
      password: hashedPassword,
      logoUrl: uploadedLogo.secure_url,
      logoId: uploadedLogo.public_id,
      role: userRole, 
    });

    const savedUser = await newUser.save();
    const { accessToken, refreshToken } = await generateTokens(savedUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      user: {
        id: savedUser._id,
        channelName: savedUser.channelName,
        phone: savedUser.phone,
        email: savedUser.email,
        logoUrl: savedUser.logoUrl,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error. Registration failed.",
      error: error.message,
    });
  }
};


export const createSuperAdmin = async (req, res) => {
  try {
    const { channelName, phone, password, email } = req.body;

    if (!channelName || !email || !password || !phone || !req.files?.logo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including channel logo.",
      });
    }

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can create another Super Admin.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadedLogo = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath,
      { folder: "logos" }
    );

    const newSuperAdmin = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName,
      phone,
      email,
      password: hashedPassword,
      logoUrl: uploadedLogo.secure_url,
      logoId: uploadedLogo.public_id,
      role: 'superadmin'
    });

    const savedUser = await newSuperAdmin.save();
    
    const { accessToken, refreshToken } = await generateTokens(savedUser._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Super Admin created successfully!",
      accessToken,
      user: {
        id: savedUser._id,
        channelName: savedUser.channelName,
        phone: savedUser.phone,
        email: savedUser.email,
        logoUrl: savedUser.logoUrl,
        role: savedUser.role, // Ensure role is included in response
      },
    });
  } catch (error) {
    console.error("Super Admin Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error. Super Admin creation failed.",
      error: error.message,
    });
  }
};


// Create Admin (only accessible by Super Admin)
export const createAdmin = async (req, res) => {
  try {
    const { channelName, phone, password, email } = req.body;

    if (!channelName || !email || !password || !phone || !req.files?.logo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including channel logo.",
      });
    }

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin can create an Admin.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadedLogo = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath,
      { folder: "logos" }
    );

    const newAdmin = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName,
      phone,
      email,
      password: hashedPassword,
      logoUrl: uploadedLogo.secure_url,
      logoId: uploadedLogo.public_id,
      role: 'admin',
    });

    const savedUser = await newAdmin.save();
    const { accessToken, refreshToken } = await generateTokens(savedUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully!",
      accessToken,
      user: {
        id: savedUser._id,
        channelName: savedUser.channelName,
        phone: savedUser.phone,
        email: savedUser.email,
        logoUrl: savedUser.logoUrl,
      },
    });
  } catch (error) {
    console.error("Admin Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error. Admin creation failed.",
      error: error.message,
    });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken,
      user: {
        _id: user._id,
        channelName: user.channelName,
        email: user.email,
        phone: user.phone,
        logoId: user.logoId,
        logoUrl: user.logoUrl,
        subscribers: user.subscribers,
        subscribedChannels: user.subscribedChannels,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0, 
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful!",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
