import jwt from "jsonwebtoken";
import Video from "../models/video.model.js"; 

export const checkAuthentication = async (req, res, next) => {
    
     let authHeader = req.headers["authorization"];
       // console.log("Authorization header:", req.headers.authorization);
     const token = authHeader && authHeader.split(" ")[1];
      // console.log("token ",token);
    if (!token) {
        return res.status(401).json({ 
        success:false,
        message: "Access Denied: No Token Provided" 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      req.user = decoded;
      next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ 
          success:false,
          message: "Invalid Token" 
        });
    }
};


export const checkOwnership = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ 
        success:false,
        error: "Video not found" 
      });
    }

    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You don't have permission to perform this action" });
    }

    next();
  } catch (error) {
    console.log("Error checking video ownership", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};