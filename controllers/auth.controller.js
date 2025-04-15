import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.js"; 
import User from "../models/user.model.js";
import  { generateToken } from "../utils/generateToken.util.js"

export const register = async (req, res) => {
  try {
    const { channelName, phone, password, email } = req.body;

    if (!channelName || !email || !password || !phone || !req.files?.logo) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including channel logo.",
      });
    }
    console.log("Logo file info:", req.files?.logo);


     const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadedLogo = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath
    );

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName,
      phone,
      email,
      password: hashedPassword,
      logoUrl: uploadedLogo.secure_url,
      logoId: uploadedLogo.public_id,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: savedUser._id,
        channelName: savedUser.channelName,
        phone: savedUser.phone,
        logoUrl: savedUser.logoUrl,
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

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
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
    console.log("ERROR", error);
    res.status(500).json({ 
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

