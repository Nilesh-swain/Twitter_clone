import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import Post from "../model/post.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createpost = async (req, res) => {
  try {
    const { text, imgUrl } = req.body;
    const userId = req.user._id.toString();

    console.log("createpost called with:", { text: text ? "present" : "empty", imgUrl: imgUrl ? "present" : "absent", userId });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!imgUrl && !text) {
      return res.status(400).json({ error: "Post cannot be empty" });
    }

    const newPost = new Post({
      user: userId,
      text,
      img: imgUrl,
    });

    await newPost.save();
    console.log("Post created successfully:", newPost._id);
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createpost:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    console.log("Delete request received", {
      postId: req.params.id,
      requestUser: req.user ? req.user._id : null,
    });
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.warn(`Delete failed: Post not found (id: ${req.params.id})`);
      return res
        .status(404)
        .json({ error: "Post not found", id: req.params.id });
    }

    if (!req.user || !req.user._id) {
      console.warn("Delete failed: No user in request");
      return res.status(401).json({ error: "Unauthorized: No user info" });
    }

    console.log("Post found", {
      postUser: post.user.toString(),
      requestUser: req.user._id.toString(),
    });

    if (post.user.toString() !== req.user._id.toString()) {
      console.warn(
        `Delete failed: Unauthorized user (post user: ${post.user}, req user: ${req.user._id})`
      );
      return res.status(403).json({
        error: "You are not authorized to delete this post",
        postUser: post.user,
        reqUser: req.user._id,
      });
    }

    // Delete associated image from Cloudinary if it exists
    if (post.img) {
      try {
        const imgPublicId = post.img.split("/").pop().split(".")[0];
        console.log("Attempting to delete image from Cloudinary:", imgPublicId);
        const cloudinaryResult = await cloudinary.uploader.destroy(imgPublicId);
        console.log("Cloudinary delete result:", cloudinaryResult);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with post deletion even if image deletion fails
        // This prevents orphaned posts when Cloudinary operations fail
      }
    }

    // Delete the post from database
    await Post.findByIdAndDelete(req.params.id);

    console.log("Post deleted successfully", { postId: req.params.id });
    return res
      .status(200)
      .json({ message: "Post deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Error in deletePost:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const CommentOnPost = async (req, res) => {
  try {
    const { text, parentCommentId } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required." });
    }

    const postDoc = await Post.findById(postId);
    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };
    if (parentCommentId) {
      comment.parentComment = parentCommentId;
    }
    postDoc.comments.push(comment);
    await postDoc.save();

    return res
      .status(200)
      .json({ message: "Comment added successfully", post: postDoc });
  } catch (error) {
    console.error("Error in CommentOnPost:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      post.likes = post.likes.filter(id => !id.equals(userId));
      await post.save();
      await User.updateOne({ _id: userId }, { $pull: { likes: postId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likes: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetallPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in GetallPosts:", error);
    return res.status(500).json({ message: "Intenal Server Error" });
  }
};

export const GetLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId); // ✅ use lowercase variable name
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likes } })
      .populate("user", "-password")
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.error("Error in GetLikedPosts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following;
    const posts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error in GetFollowingPosts:", error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error in getUserPost:", error);
  }
};
