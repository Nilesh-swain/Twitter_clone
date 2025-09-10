import express from "express";
import protectRoute from "../middleware/protectRoute.js";

import {
  createpost,
  deletePost,
  CommentOnPost,
  likeUnlikePost,
  GetallPosts,
  GetLikedPosts,
  GetFollowingPosts,
  getUserPost
} from "../controller/post.controller.js";

const router = express.Router();
router.get("/all",protectRoute, GetallPosts);
router.get("/following",protectRoute, GetFollowingPosts);
router.get("/likes/:id", protectRoute, GetLikedPosts); 
router.post("/create", protectRoute, createpost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", CommentOnPost);
router.get("/username/:username", protectRoute, getUserPost);

export default router;
