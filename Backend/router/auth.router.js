import express from "express";
import { Login, SignUp, LogOut, GetMe, CreateAdmin, requestPasswordReset, verifyOTP, resetPassword, verifySignupOTP, resendSignupOTP } from "../controller/auth.controller.js";
import protectRouter from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRouter, GetMe);
router.post("/login", Login);
router.post("/signup", SignUp);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/resend-signup-otp", resendSignupOTP);
router.post("/create-admin", CreateAdmin);
router.post("/request-reset", requestPasswordReset);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/logout", LogOut);

export default router;
