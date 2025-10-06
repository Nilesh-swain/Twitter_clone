import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";

import Post from "../../components/common/Post";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { useAuth } from "../../contexts/AuthContext";
import { userAPI, postAPI } from "../../utils/api";
import useFollowUnfollow from "../../hooks/usefollow";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => userAPI.getProfile(username),
    enabled: !!username,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", username, feedType],
    queryFn: () =>
      feedType === "posts"
        ? postAPI.getUserPosts(username)
        : postAPI.getLikedPosts(user?._id),
    enabled: !!username && !!user,
  });

  const isMyProfile = user?._id === currentUser?._id;
  const isFollowing = currentUser?.following?.includes(user?._id);

  const { followUnfollow, isPending } = useFollowUnfollow();

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "coverImg") setCoverImg(reader.result);
        if (state === "profileImg") setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen border-r border-gray-700 bg-[#0f0f10] text-white">
      {/* HEADER */}
      {isLoading && <ProfileHeaderSkeleton />}
      {!isLoading && !user && (
        <p className="text-center text-lg mt-4 text-slate-400">
          User not found
        </p>
      )}

      {!isLoading && user && (
        <div className="flex flex-col">
          {/* TOP BAR */}
          <div className="flex items-center gap-4 px-4 py-3 sticky top-0 backdrop-blur-md bg-black/50 border-b border-gray-800 z-20">
            <Link to="/">
              <FaArrowLeft className="w-5 h-5 text-slate-300 hover:text-white transition" />
            </Link>
            <div>
              <h2 className="font-bold text-lg">{user?.fullname}</h2>
              <p className="text-sm text-slate-400">
                {posts ? posts.length : 0} posts
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* COVER IMAGE */}
            <div className="relative group/cover">
            <img
              src={coverImg || user?.coverImg || "/cover.png"}
              alt="cover"
              className="h-56 w-full object-cover"
            />
            {isMyProfile && (
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-black/60 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
              </div>
            )}
            <input
              type="file"
              hidden
              accept="image/*"
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type="file"
              hidden
              accept="image/*"
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />

            {/* PROFILE IMAGE */}
            <div className="absolute -bottom-16 left-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-black group/avatar">
                <img
                  src={
                    profileImg || user?.profileImg || "/avatar-placeholder.png"
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
                {isMyProfile && (
                  <div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition"
                    onClick={() => profileImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PROFILE ACTIONS */}
          <div className="flex justify-end px-4 mt-5">
            {isMyProfile && <EditProfileModal />}
            {!isMyProfile && (
              <button
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  isFollowing
                    ? "bg-transparent border-slate-600 hover:bg-slate-800"
                    : "bg-primary text-white border-primary hover:bg-primary/80"
                }`}
                onClick={() => followUnfollow(user._id)}
                disabled={isPending}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            {(coverImg || profileImg) && (
              <button
                className="ml-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5"
                onClick={() => toast.success("Profile updated successfully")}
              >
                Update
              </button>
            )}
          </div>

          {/* PROFILE DETAILS */}
          <div className="flex flex-col gap-3 mt-16 px-6">
            <h1 className="font-extrabold text-2xl">{user?.fullname}</h1>
            <p className="text-slate-400">@{user?.username}</p>
            {user?.bio && <p className="text-sm text-slate-300">{user?.bio}</p>}

            <div className="flex gap-4 flex-wrap mt-2 text-slate-400 text-sm">
              {user?.link && (
                <a
                  href={user.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-blue-400 transition"
                >
                  <FaLink className="w-4 h-4" />
                  {user.link.replace(/^https?:\/\//, "")}
                </a>
              )}
              <div className="flex items-center gap-1">
                <IoCalendarOutline className="w-4 h-4" />
                <span>Joined July 2021</span>
              </div>
            </div>

            <div className="flex gap-4 mt-1">
              <span className="text-sm">
                <span className="font-bold">{user?.following.length}</span>{" "}
                <span className="text-slate-400">Following</span>
              </span>
              <span className="text-sm">
                <span className="font-bold">{user?.followers.length}</span>{" "}
                <span className="text-slate-400">Followers</span>
              </span>
            </div>
          </div>

          {/* TABS */}
          <div className="flex w-full border-b border-gray-700 mt-5">
            <div
              className={`flex justify-center flex-1 p-3 cursor-pointer transition relative ${
                feedType === "posts"
                  ? "font-semibold text-white"
                  : "text-slate-400 hover:bg-gray-800"
              }`}
              onClick={() => setFeedType("posts")}
            >
              Posts
              {feedType === "posts" && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500" />
              )}
            </div>
            <div
              className={`flex justify-center flex-1 p-3 cursor-pointer transition relative ${
                feedType === "likes"
                  ? "font-semibold text-white"
                  : "text-slate-400 hover:bg-gray-800"
              }`}
              onClick={() => setFeedType("likes")}
            >
              Likes
              {feedType === "likes" && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500" />
              )}
            </div>
          </div>

          {/* POSTS */}
          {postsLoading ? (
            <div className="flex flex-col justify-center">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : posts?.length === 0 ? (
            <p className="text-center my-6 text-slate-400">
              No posts in this tab. Switch 👻
            </p>
          ) : (
            <div className="space-y-4 mt-4">
              {posts.map((post) => (
                <div key={post._id} className="mx-2">
                  <Post post={post} />
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
