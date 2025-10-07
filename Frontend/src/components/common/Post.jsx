import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { postAPI } from "../../utils/api.js";

const CommentItem = ({
  comment,
  replies,
  postOwnerId,
  onReply,
  replyTo,
  replyText,
  setReplyText,
  onPostReply,
  onCancelReply,
  isReplying,
  depth = 0,
}) => {
  const isAuthor = comment.user._id === postOwnerId;

  return (
    <div
      className={`${depth > 0 ? "ml-8 border-l-2 border-gray-700 pl-4" : ""}`}
    >
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={comment.user?.profileImg || "/avatar-placeholder.png"}
            alt={comment.user?.fullname}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{comment.user?.fullname}</span>
            {isAuthor && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                author
              </span>
            )}
            <span className="text-gray-500">@{comment.user?.username}</span>
          </div>
          <p className="text-white mb-2">{comment.text}</p>
          <button
            onClick={() => onReply(comment._id)}
            className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Reply form */}
      {replyTo === comment._id && (
        <form onSubmit={onPostReply} className="mt-3 ml-11">
          <div className="flex gap-2">
            <textarea
              className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary text-sm"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="2"
            />
            <div className="flex flex-col gap-1">
              <button
                type="submit"
                className="twitter-button px-3 py-1 text-xs font-semibold"
                disabled={isReplying || !replyText.trim()}
              >
                {isReplying ? <LoadingSpinner /> : "Reply"}
              </button>
              <button
                type="button"
                onClick={onCancelReply}
                className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              replies={[]} // For simplicity, only one level deep
              postOwnerId={postOwnerId}
              onReply={onReply}
              replyTo={replyTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onPostReply={onPostReply}
              onCancelReply={onCancelReply}
              isReplying={isReplying}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Post = ({ post, repostedBy }) => {
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const queryClient = useQueryClient();

  // Function to format time ago
  const timeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    const intervals = [
      { label: 'y', seconds: 31536000 },
      { label: 'mo', seconds: 2592000 },
      { label: 'w', seconds: 604800 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return count + interval.label;
      }
    }
    return 'now';
  };

  // Get current user
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch auth user");
      return res.json();
    },
  });

  // Delete post mutation
  const { mutate: deletePost, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/post/${post._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await res.json().catch(() => {
        throw new Error("Error while deleting post.");
      });
      if (!res.ok) throw new Error("Failed to delete post");
      return;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries(["posts"]); // Auto refresh posts
    },
    onError: (err) => toast.error(err.message),
  });

  // Like post mutation
  const { mutate: likePost } = useMutation({
    mutationFn: async () => {
      return postAPI.likePost(post._id);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["posts"]); // Refresh posts to update like count
    },
    onError: (err) => toast.error(err.message),
  });

  // Repost post mutation
  const { mutate: repostPost } = useMutation({
    mutationFn: async () => {
      return postAPI.repostPost(post._id);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["posts"]); // Refresh posts to update repost count
    },
    onError: (err) => toast.error(err.message),
  });

  // Bookmark post mutation
  const { mutate: bookmarkPost } = useMutation({
    mutationFn: async () => {
      return postAPI.bookmarkPost(post._id);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["authUser"]); // Refresh authUser to update bookmarks
    },
    onError: (err) => toast.error(err.message),
  });

  // Comment on post mutation
  const { mutate: commentOnPost, isLoading: isCommenting } = useMutation({
    mutationFn: async (commentText) => {
      return postAPI.commentOnPost(post._id, commentText);
    },
    onSuccess: () => {
      toast.success("Comment posted!");
      setComment("");
      queryClient.invalidateQueries(["posts"]); // Refresh posts to show new comment
    },
    onError: (err) => toast.error(err.message),
  });

  // Reply to comment mutation
  const { mutate: replyToComment, isLoading: isReplying } = useMutation({
    mutationFn: async ({ commentText, parentCommentId }) => {
      return postAPI.commentOnPost(post._id, commentText, parentCommentId);
    },
    onSuccess: () => {
      toast.success("Reply posted!");
      setReplyText("");
      setReplyTo(null);
      queryClient.invalidateQueries(["posts"]); // Refresh posts to show new reply
    },
    onError: (err) => toast.error(err.message),
  });

  const postOwner = post?.user;
  const isMyPost = authUser?._id === postOwner?._id;
  const isLiked = post.likes?.includes(authUser?._id) || false;
  const isReposted = post.reposts?.includes(authUser?._id) || false;
  const isBookmarked = authUser?.bookmarks?.includes(post._id) || false;
  const formattedDate = timeAgo(post.createdAt);

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    commentOnPost(comment);
  };

  const handleLikePost = () => {
    likePost();
  };

  const handleRepostPost = () => {
    repostPost();
  };

  const handleBookmarkPost = () => {
    bookmarkPost();
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyText("");
  };

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyTo) return;
    replyToComment({ commentText: replyText, parentCommentId: replyTo });
  };

  // Group comments by parent
  const groupComments = (comments) => {
    const topLevel = [];
    const replies = {};

    comments.forEach((comment) => {
      if (!comment.parentComment) {
        topLevel.push(comment);
      } else {
        if (!replies[comment.parentComment]) {
          replies[comment.parentComment] = [];
        }
        replies[comment.parentComment].push(comment);
      }
    });

    return { topLevel, replies };
  };

  const { topLevel, replies } = groupComments(post.comments || []);

  return (
    <article className="twitter-post p-6 hover:bg-gray-900/30 transition-all duration-200 rounded-lg border border-gray-800/50 hover:border-gray-700/50">
      {repostedBy && (
        <div className="text-gray-500 text-sm mb-2">
          <BiRepost className="inline w-4 h-4 mr-1" />
          Reposted by <Link to={`/profile/${repostedBy.username}`} className="text-blue-400 hover:underline">@{repostedBy.username}</Link>
        </div>
      )}
      <div className="flex gap-4">
        {/* Profile image */}
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-700/50">
          <Link to={`/profile/${postOwner?.username}`}>
            <img
              src={postOwner?.profileImg || "/avatar-placeholder.png"}
              alt={postOwner?.fullname}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        {/* Post content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <Link
              to={`/profile/${postOwner?.username}`}
              className="font-bold text-white hover:underline transition-colors"
            >
              {postOwner?.fullname}
            </Link>
            <span className="text-gray-500">·</span>
            <Link
              to={`/profile/${postOwner?.username}`}
              className="text-gray-400 hover:text-gray-300 hover:underline transition-colors"
            >
              @{postOwner?.username}
            </Link>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400 text-sm">{formattedDate}</span>

            {isMyPost && (
              <button
                onClick={handleDeletePost}
                className="ml-auto p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-200"
                title="Delete post"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoadingSpinner />
                ) : (
                  <FaTrash className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Text & image */}
          <div className="mb-4">
            <p className="text-white whitespace-pre-wrap break-words leading-relaxed text-lg">
              {post.text}
            </p>
            {post.img && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-gray-700/50">
                <img
                  src={post.img}
                  alt="Post content"
                  className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between max-w-lg pt-2 border-t border-gray-800/50">
            <button
              className="flex items-center gap-3 p-3 rounded-full hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-all duration-200 group"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <FaRegComment className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">
                {post.comments?.length || 0}
              </span>
            </button>

            <button
              className="flex items-center gap-3 p-3 rounded-full hover:bg-green-500/10 text-gray-400 hover:text-green-400 transition-all duration-200 group"
              onClick={handleRepostPost}
            >
              <BiRepost className={`w-5 h-5 group-hover:scale-110 transition-transform ${isReposted ? "text-green-500" : ""}`} />
              <span className={`text-sm font-medium ${isReposted ? "text-green-500" : ""}`}>
                {post.reposts?.length || 0}
              </span>
            </button>

            <button
              className="flex items-center gap-3 p-3 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-200 group"
              onClick={handleLikePost}
            >
              {isLiked ? (
                <FaHeart className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              ) : (
                <FaRegHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              <span
                className={`text-sm font-medium ${
                  isLiked ? "text-red-500" : ""
                }`}
              >
                {post.likes?.length || 0}
              </span>
            </button>

            <button
              className="flex items-center gap-3 p-3 rounded-full hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 transition-all duration-200 group"
              onClick={handleBookmarkPost}
            >
              <FaRegBookmark className={`w-5 h-5 group-hover:scale-110 transition-transform ${isBookmarked ? "text-blue-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <dialog id={`comments_modal${post._id}`} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Replies</h3>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {topLevel.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No replies yet. Be the first to reply! 😉
              </p>
            ) : (
              topLevel.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  replies={replies[comment._id] || []}
                  postOwnerId={postOwner?._id}
                  onReply={handleReply}
                  replyTo={replyTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  onPostReply={handlePostReply}
                  onCancelReply={handleCancelReply}
                  isReplying={isReplying}
                />
              ))
            )}
          </div>
          <form
            className="flex gap-2 items-center mt-4 pt-4 border-t border-gray-800"
            onSubmit={handlePostComment}
          >
            <textarea
              className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-primary"
              placeholder="Post your reply..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="2"
            />
            <button
              type="submit"
              className="twitter-button px-4 py-2 text-sm font-semibold"
              disabled={isCommenting || !comment.trim()}
            >
              {isCommenting ? (
                <div className="loading-spinner w-4 h-4"></div>
              ) : (
                "Reply"
              )}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </article>
  );
};

export default Post;
