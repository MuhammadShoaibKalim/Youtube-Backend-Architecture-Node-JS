import express from "express";
import { checkAuthentication } from "../middleware/auth.middleware.js";
import {
  createComment,
  deleteComment,
  updateComment,
  getCommentsByVideo
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/new", checkAuthentication, createComment);
router.delete("/:commentId", checkAuthentication, deleteComment);
router.put("/:commentId", checkAuthentication, updateComment);
router.get("/:videoId", getCommentsByVideo);

export default router;
