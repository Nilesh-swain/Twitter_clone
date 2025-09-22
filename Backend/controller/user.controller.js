// import User from "../model/user.model.js";
// import Notification from "../model/notification.model.js";

// // =========================
// // GET PROFILE
// // =========================
// export const GetProfile = async (req, res) => {
//   const { username } = req.params;

//   try {
//     const user = await User.findOne({
//       username: new RegExp(`^${username}$`, "i"),
//     }).select("-password");

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error("Error in GetProfile:", error.message);
//     return res.status(500).json({ error: "Something went wrong in getProfile." });
//   }
// };

// // =========================
// // FOLLOW / UNFOLLOW
// // =========================
// export const FollowUnfollow = async (req, res) => {
//   try {
//     // Ensure authenticated user
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ error: "Unauthorized: user not authenticated" });
//     }

//     const { id } = req.params; // user to follow/unfollow
//     const currentUserId = req.user._id.toString();

//     // Can't follow/unfollow yourself
//     if (id === currentUserId) {
//       return res.status(400).json({ error: "You cannot follow/unfollow yourself." });
//     }

//     const targetUser = await User.findById(id);
//     if (!targetUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const isFollowing = targetUser.followers.some(
//       (followerId) => followerId.toString() === currentUserId
//     );

//     if (isFollowing) {
//       // Unfollow
//       await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
//       await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });

//       return res.status(200).json({ message: "User unfollowed successfully." });
//     } else {
//       // Follow
//       await User.findByIdAndUpdate(id, { $addToSet: { followers: currentUserId } });
//       await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: id } });

//       // 🔹 Add notification logic later if needed
//      // 🔹 Create notification
//       const newNotification = new Notification({
//         from: currentUserId,
//         to: id,
//         type: "follow",
//       });

//       await newNotification.save();

//       return res.status(200).json({ message: "User followed successfully." });
//     }
//   } catch (error) {
//     console.error("Error in FollowUnfollow user:", error.message);
//     return res.status(500).json({ error: "Something went wrong in FollowUnfollow user." });
//   }
// };

// controllers/user.controller.js
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import mongoose from "mongoose";
import User from "../model/user.model.js";
import Notification from "../model/notification.model.js"; // ✅ make sure this path matches your file

// =========================
// GET PROFILE
// =========================
export const GetProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({
      username: new RegExp(`^${username}$`, "i"),
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in GetProfile:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong in getProfile." });
  }
};

// =========================
// FOLLOW / UNFOLLOW + NOTIFICATION
// =========================
export const FollowUnfollow = async (req, res) => {
  try {
    // Must be authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: user not authenticated" });
    }

    const { id } = req.params; // target user id
    const currentUserId = req.user._id; // logged in user id (ObjectId)

    // Validate target id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }

    // Prevent self-follow
    if (String(currentUserId) === String(id)) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself." });
    }

    // Fetch target user
    const targetUser = await User.findById(id).select("_id followers");
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Are we already following?
    const isFollowing = targetUser.followers?.some(
      (f) => String(f) === String(currentUserId)
    );

    if (isFollowing) {
      // ---------- UNFOLLOW ----------
      await Promise.all([
        User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } }),
        User.findByIdAndUpdate(currentUserId, { $pull: { following: id } }),
        Notification.deleteMany({
          from: currentUserId,
          to: id,
          type: "follow",
        }), // clean old notifications
      ]);

      return res.status(200).json({ message: "User unfollowed successfully." });
    } else {
      // ---------- FOLLOW ----------
      await Promise.all([
        User.findByIdAndUpdate(id, { $addToSet: { followers: currentUserId } }),
        User.findByIdAndUpdate(currentUserId, { $addToSet: { following: id } }),
      ]);

      // Create notification
      try {
        const doc = await Notification.create({
          from: currentUserId,
          to: id,
          type: "follow",
        });
        console.log("✅ Notification created:", doc._id);
      } catch (notifyErr) {
        console.error("❌ Notification creation failed:", notifyErr);
        // not throwing here so follow still works even if notification fails
      }

      return res.status(200).json({ message: "User followed successfully." });
    }
  } catch (error) {
    console.error("Error in FollowUnfollow user:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong in FollowUnfollow user.",
    });
  }
};

// ==========================
// GET SUGGESTIONS
// ==========================
export const GetSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get list of users the current user is following
    const currentUser = await User.findById(userId).select("following");

    // 2. Build exclusion list: current user + people already followed
    const excludeIds = [userId, ...(currentUser.following || [])];

    // 3. Aggregate random users not in exclude list
    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $nin: excludeIds } } },
      { $sample: { size: 4 } }, // pick 4 random
      { $project: { password: 0 } }, // remove password field
    ]);

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error in GetSuggestions:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong in GetSuggestions." });
  }
};

export const UpdateUser = async (req, res) => {
  const { fullname, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res.status(400).json({
        error:
          "Both current and new passwords are required to change password.",
      });
    }
    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        return res
          .status(400)
          .json({ error: "Current password is incorrect." });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "New password must be at least 6 characters long." });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      //it is for deleting the old image from the cloudinary.
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadResponse.secure_url;
    }
    if (coverImg) {
      //it is for deleting the old image from the cloudinary.
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadResponse.secure_url;
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();
    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in UpdateUser:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong in UpdateUser." });
  }
};
