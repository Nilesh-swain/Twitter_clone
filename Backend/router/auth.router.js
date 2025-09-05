import express from "express";
import { Login, SignUp, LogOut } from "../controller/auth.controller.js";

const router = express.Router();


router.post("/login", Login);
router.post("/signup", SignUp);
router.post("/logout", LogOut);

export default router;
