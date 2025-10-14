import express from "express";
import protectRoute from "../middleware/protectRoute.js";

import {
  createpost,
  deletePost,
  CommentOnPost,
  likeUnlikePost,
  repostUnrepostPost,
  bookmarkUnbookmarkPost,
  GetallPosts,
  GetLikedPosts,
  GetFollowingPosts,
  getUserPost,
  getBookmarkedPosts,
  getRepostedPosts,
} from "../controller/post.controller.js";

const router = express.Router();
router.get("/all", GetallPosts);
router.get("/following", protectRoute, GetFollowingPosts);
router.get("/likes/:id", protectRoute, GetLikedPosts);
router.post("/create", protectRoute, createpost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/repost/:id", protectRoute, repostUnrepostPost);
router.post("/bookmark/:id", protectRoute, bookmarkUnbookmarkPost);
router.post("/comment/:id", protectRoute, CommentOnPost);
router.get("/username/:username", protectRoute, getUserPost);
router.get("/bookmarked", protectRoute, getBookmarkedPosts);
router.get("/reposted/:username", protectRoute, getRepostedPosts);

export default router;
