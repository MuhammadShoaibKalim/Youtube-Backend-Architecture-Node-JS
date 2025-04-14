import express from "express";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register );
router.post("/login", (req, res) => {
  res.send("Login Route");
});

export default router;