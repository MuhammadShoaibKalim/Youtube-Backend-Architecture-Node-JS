
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Video from "../models/video.model.js";
import bcrypt from "bcrypt";



export const updateProfile = (async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const {
    channelName,
    logoUrl,
    logoId
  } = req.body;

  const updates = {};

  if (req.files?.avatar) {
    if (user.avatar) {
      // Optional (point): delete previous avatar from cloudinary
      // await cloudinary.uploader.destroy(user.avatarId);
    }
    const result = await cloudinary.uploader.upload(req.files.avatar.tempFilePath, {
      folder: "avatars",
    });
    updates.avatar = result.secure_url;
  }

  if (req.files?.cover) {
    if (user.cover) {
      // Optional: delete previous cover
    }
    const result = await cloudinary.uploader.upload(req.files.cover.tempFilePath, {
      folder: "covers",
    });
    updates.cover = result.secure_url;
  }

  if (channelName) updates.channelName = channelName;
  if (logoUrl) updates.logoUrl = logoUrl;
  if (logoId) updates.logoId = logoId;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).select("-password -refreshToken");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

export const getCurrentUser = (async (req, res) => {
  // console.log("Looking for user with _id:", req.user._id);
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, user });
});

export const changeUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide both old and new passwords' });
  }

  try {
    const user = await User.findById(req.user._id); 

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
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

export const unsubscribe = (async (req, res) => {
  const { channelId } = req.body;
  if (req.user._id === channelId) {
    throw new ApiError(400, "You cannot unsubscribe from yourself");
  }

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { subscribedChannels: channelId },
  });

  await User.findByIdAndUpdate(channelId, {
    $inc: { subscribers: -1 },
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Unsubscribed successfully")
  );
});

export const getUserChannel = (async (req, res) => {
    const { id } = req.params;
  
    const user = await User.findById(id)
      .select('username email avatar cover subscribers createdAt')
      .populate({
        path: 'followers',
        select: 'username avatar',
      })
      .populate({
        path: 'subscriptions',
        select: 'username avatar',
      });
  
    if (!user) {
      res.status(404);
      throw new Error("Channel not found");
    }
  
    res.status(200).json({
      success: true,
      channel: user,
    });
  });

export const getUserChannelProfile = (async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .select('username email avatar cover subscribers createdAt')
    .populate('followers', 'username avatar')
    .populate('subscriptions', 'username avatar');

  if (!user) {
    res.status(404);
    throw new Error('Channel not found');
  }

  res.status(200).json({ success: true, channel: user });
});

export const getUserWatchHistory = (async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('watchHistory')
    .populate('watchHistory', 'title thumbnail duration');

  res.status(200).json({ success: true, watchHistory: user.watchHistory });
});

export const validUser = (async (req, res) => {
  res.status(200).json({ success: true, userId: req.user.id });
});