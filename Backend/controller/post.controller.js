import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import Post from "../model/post.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createpost = async (req, res) => {
  try {
    const { text, img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!img && !text) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    let imageUrl = null;
    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      imageUrl = uploadResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img: imageUrl,
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createpost:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgPublicId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgPublicId);
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const CommentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
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
      await post.updateOne({ _id: postId }, { $pull: { likes: userId } });
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
        type: "comments.user",
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
    const user = await user.findone({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate({
        type: "comments.user",
        select: "-password",
      });
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error in getUserPost:", error);
  }
};
