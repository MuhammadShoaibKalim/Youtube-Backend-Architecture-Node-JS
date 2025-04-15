
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Video from "../models/video.model.js";

export const updateProfile = async (req, res) => {
    try {
      const {  channelName, phone } = req.body;
      let updatedData = { channelName, phone };
  
      if (req.files && req.files.logoUrl) {
        const uploadedImage = await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath);
        updatedData.logoUrl = uploadedImage.secure_url;
        updatedData.logoId = uploadedImage.public_id;
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });
  
      res.status(200).json({ 
        success:true,
        message: "Profile updated successfully", 
        updatedUser
       });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({ 
        success:false,
        error: "Something went wrong"
       });
    }
  };

export const subscribe  = async (req, res) => {
    try {
      const {channelId } = req.body; 
  
      if ( req.user._id === channelId) {
        return res.status(400).json({ 
            success:false,
            error: "You cannot subscribe to your own channel" 
        });
      }
  
     const currentSubscriber = await User.findByIdAndUpdate(req.user._id , {
        $addToSet: { subscribedChannels: channelId },
      });
  
     const subscribeUser = await User.findByIdAndUpdate(channelId, {
        $inc: { subscribers: 1 },
      });
  
      res.status(200).json({ 
        success:true,
        message: "Subscribed successfully",
        data:{
            currentSubscriber,
            subscribeUser,
        }
       });
    } catch (error) {
      console.error("Subscription Error:", error);
      res.status(500).json({ 
        success:false,
        error: "Something went wrong" 
    });
    }
  };