import express from "express";
import protectRoute from "../middleware/protectRoute.js";

import {
  GetProfile,
  FollowUnfollow,
  GetSuggestions,
  UpdateUser,
  SearchUsers,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, GetProfile);
router.post("/follow/:id", protectRoute, FollowUnfollow);
router.get("/suggested", protectRoute, GetSuggestions); // Placeholder for suggested users route
router.post("/suggested", protectRoute, GetSuggestions); // Allow POST as well
router.post("/update", protectRoute, UpdateUser); // Update user details
router.get("/search", protectRoute, SearchUsers); // Search users

export default router;
