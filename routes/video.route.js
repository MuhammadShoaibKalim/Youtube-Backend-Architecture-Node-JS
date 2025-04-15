import express from "express";
import { checkAuthentication } from "../middleware/auth.middleware.js";
import {
  uploadVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getMyVideos,
  getVideoById,
  getVideosByCategory,
  getVideosByTag,
  likeVideo,
  dislikeVideo
} from "../controllers/video.controller.js";



const router = express.Router();



router.post("/upload", checkAuthentication, uploadVideo);//
router.put("/:id", checkAuthentication, updateVideo);//
router.delete("/:id", checkAuthentication, deleteVideo);
router.get("/all", getAllVideos);//
router.get("/my-videos", checkAuthentication, getMyVideos);//
router.get("/:id", checkAuthentication, getVideoById);//
router.get("/category/:category", getVideosByCategory);//
router.get("/tags/:tag", getVideosByTag);//
router.post("/like", checkAuthentication, likeVideo);//
router.post("/dislike", checkAuthentication, dislikeVideo);//

export default router;