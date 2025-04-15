import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Video from "../models/video.model.js";

export const uploadVideo = async (req, res) => {
    try {
      const { title, description, category, tags } = req.body;
      
      if (!title || !description || !category) {
        return res.status(400).json({ 
          success: false,
          message: "Title, description, and category are required" 
        });
      }

      if (!req.files || !req.files.video || !req.files.thumbnail) {
        return res.status(400).json({ 
          success: false,
          message: "Video and thumbnail files are required" 
        });
      }

      const videoFile = req.files.video;
      const thumbnailFile = req.files.thumbnail;
      
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      
      if (!allowedVideoTypes.includes(videoFile.mimetype)) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid video format. Supported formats: MP4, WebM, OGG" 
        });
      }

      if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid thumbnail format. Supported formats: JPEG, PNG, JPG" 
        });
      }

      const videoUpload = await cloudinary.uploader.upload(videoFile.tempFilePath, {
        resource_type: "video",
        folder: "videos",
        chunk_size: 6000000, 
        eager: [
          { width: 300, height: 300, crop: "pad" },
          { width: 160, height: 100, crop: "crop", gravity: "south" }
        ]
      });

      const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile.tempFilePath, {
        folder: "thumbnails",
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto" }
        ]
      });

      const newVideo = new Video({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        user_id: req.user._id,
        videoUrl: videoUpload.secure_url,
        videoId: videoUpload.public_id,
        thumbnailUrl: thumbnailUpload.secure_url,
        thumbnailId: thumbnailUpload.public_id,
        category,
        tags: tags ? tags.split(",") : [],
      });
      

      await newVideo.save();
      
      res.status(201).json({ 
        success: true,
        message: "Video uploaded successfully", 
        video: newVideo 
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Something went wrong",
        error: error.message 
      });
    }
  }

export const updateVideo = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const videoId = req.params.id;

    let video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ 
        success:false,
        error: "Video not found" 
    });

    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success:false,
        error: "Unauthorized" 
    });
    }

    if (req.files && req.files.thumbnail) {
      await cloudinary.uploader.destroy(video.thumbnmailId);

      const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {
        folder: "thumbnails",
      });

      video.thumbnmailUrl = thumbnailUpload.secure_url;
      video.thumbnmailId = thumbnailUpload.public_id;
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags ? tags.split(",") : video.tags;

    await video.save();
    res.status(200).json({ 
        success:true,
        message: "Video updated successfully", video 
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteVideo = async (req, res) => {
    try {
      const videoId = req.params.id;
  
      let video = await Video.findById(videoId);
      if (!video) return res.status(404).json({ error: "Video not found" });
  
      if (video.user_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false,
          error: "Unauthorized" 
        });
      }
  
      if (video.videoId) {
        await cloudinary.uploader.destroy(video.videoId, { resource_type: "video" });
      }
  
      if (video.thumbnailId) {
        await cloudinary.uploader.destroy(video.thumbnailId);
      }
  
      await Video.findByIdAndDelete(videoId);
  
      res.status(200).json({ 
        success: true,
        message: "Video deleted successfully" 
      });
  
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ 
        success: false,
        message: "Something went wrong" 
      });
    }
  };
  

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json({
        success:true,
        message: "Videos fetched successfully",
        videos
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ 
        success:false,
        message: "Something went wrong" 
    });
  }
};

export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(
        {
            success:true,
            message: "Videos fetched successfully",
            videos 
        }
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ 
        success:false,
        message: "Something went wrong" 
    });
  }
};

export const getVideoById  = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user._id;

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $addToSet: { viewedBy: userId },
      },
      { new: true }
    );

    if (!video) return res.status(404).json({ 
        success:false,
        error: "Video not found" 
    });

    res.status(200).json(video);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ 
        success:false,
        message: "Something went wrong" 
    });
  }
};

export const getVideosByCategory = async (req, res) => {
  try {
    const videos = await Video.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ 
        success:false,
        message: "Something went wrong" 
    });
  }
};

export const getVideosByTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const videos = await Video.find({ tags: tag }).sort({ createdAt: -1 });
    res.status(200).json({
        success:true,
        message: "Videos fetched successfully",
        videos
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ 
        success:false,
        message: "Something went wrong" 
    });
  }
};

export const likeVideo = async (req, res) => {
    try {
      const { videoId } = req.body;
  
      const video = await Video.findById(videoId);
  
      if (!video) {
        return res.status(404).json({ success: false, message: "Video not found" });
      }
  
      if (!video.likedBy.includes(req.user._id)) {
        video.likedBy.push(req.user._id);
        video.likes += 1;
      }
  
      const index = video.disLikedBy.indexOf(req.user._id);
      if (index !== -1) {
        video.disLikedBy.splice(index, 1);
        video.dislikes -= 1;
      }
  
      await video.save();
  
      res.status(200).json({ success: true, message: "Liked the video" });
    } catch (error) {
      console.error("Like Error:", error);
      res.status(500).json({ success: false, error: "Something went wrong" });
    }
  };
  

  export const dislikeVideo = async (req, res) => {
    try {
      const { videoId } = req.body;
  
      const video = await Video.findById(videoId);
  
      if (!video) {
        return res.status(404).json({ success: false, message: "Video not found" });
      }
  
      if (!video.disLikedBy.includes(req.user._id)) {
        video.disLikedBy.push(req.user._id);
        video.dislikes += 1;
      }
  
      const index = video.likedBy.indexOf(req.user._id);
      if (index !== -1) {
        video.likedBy.splice(index, 1);
        video.likes -= 1;
      }
  
      await video.save();
  
      res.status(200).json({ success: true, message: "Disliked the video" });
    } catch (error) {
      console.error("Dislike Error:", error);
      res.status(500).json({ success: false, error: "Something went wrong" });
    }
  };
  
