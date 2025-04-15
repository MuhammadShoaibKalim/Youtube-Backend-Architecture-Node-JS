import express from "express";
const router = express.Router();
import { subscribe, updateProfile } from "../controllers/user.controller.js";
import { checkAuthentication } from "../middleware/auth.middleware.js";

router.put("/update-profile", checkAuthentication , updateProfile )
router.post("/subscribe",checkAuthentication , subscribe );

export default router;