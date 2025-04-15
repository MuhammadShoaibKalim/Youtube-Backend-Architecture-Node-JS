import express from "express";
import {
  subscribe,
  unsubscribe,
  updateProfile,
  getUserChannel,
  getCurrentUser,
  changeUserPassword,
  getUserWatchHistory,
  validUser,
} from "../controllers/user.controller.js";

import {
  checkAuthentication,
  checkRole
} from "../middleware/auth.middleware.js";

const router = express.Router();

// All users (authenticated)
router.put("/update-profile", checkAuthentication, updateProfile);//
router.get("/me", checkAuthentication, getCurrentUser);//
router.post("/change-password", checkAuthentication, changeUserPassword);//
router.get("/watch-history", checkAuthentication, getUserWatchHistory);
router.get("/validate-user", checkAuthentication, validUser);
router.get("/channel/:id", checkAuthentication, getUserChannel);

// Only users (role-based)
router.post("/subscribe", checkAuthentication, checkRole("user"), subscribe);
router.post("/unsubscribe", checkAuthentication, checkRole("user"), unsubscribe);

export default router;
