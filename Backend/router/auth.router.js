import express from "express";
import { Login, SignUp, LogOut, GetMe } from "../controller/auth.controller.js";
import protectRouter from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRouter, GetMe);
router.post("/login", Login);
router.post("/signup", SignUp);
router.post("/logout", LogOut);

export default router;
