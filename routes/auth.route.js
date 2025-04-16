import express from "express";
import { register, login, logout, createSuperAdmin, createAdmin } from "../controllers/auth.controller.js";
import { checkAuthentication, checkSuperAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/create-super-admin", createSuperAdmin);
//after creating super admin then add this for next superadmin checkSuperAdmin. 
router.post("/create-admin", checkAuthentication, checkSuperAdmin, createAdmin);


export default router;
