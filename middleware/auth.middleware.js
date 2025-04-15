import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";

// Token 
export const checkAuthentication = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: No Token Provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log("Decoded user:", req.user);
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

// Reusable Role Middleware
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only [${allowedRoles.join(", ")}] allowed.`,
      });
    }
    next();
  };
};

//Role Middleware
export const checkAdmin = checkRole("admin", "superadmin");
export const checkSuperAdmin = checkRole("superadmin");

// Ownership Middleware 
export const checkOwnership = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: "Video not found",
      });
    }

    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "You don't have permission to perform this action",
      });
    }

    next();
  } catch (error) {
    console.log("Error checking video ownership", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
