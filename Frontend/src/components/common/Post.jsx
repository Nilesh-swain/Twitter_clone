import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const postOwner = post.user;
  const isLiked = false;

  const isMyPost = true;

  const formattedDate = "1h";

  const isCommenting = false;

  const handleDeletePost = () => {};

  const handlePostComment = (e) => {
    e.preventDefault();
  };

  const handleLikePost = () => {};

  return (
    <article className="twitter-post p-4 hover:bg-gray-900/50 transition-colors">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Link to={`/profile/${postOwner.username}`}>
            <img
              src={postOwner.profileImg || "/avatar-placeholder.png"}
              alt={postOwner.fullname}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/profile/${postOwner.username}`}
              className="font-semibold hover:underline"
            >
              {postOwner.fullname}
            </Link>
            <span className="text-gray-500">·</span>
            <Link
              to={`/profile/${postOwner.username}`}
              className="text-gray-500 hover:underline"
            >
              @{postOwner.username}
            </Link>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{formattedDate}</span>

            {isMyPost && (
              <button
                onClick={handleDeletePost}
                className="ml-auto p-1 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-colors"
                title="Delete post"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mb-3">
            <p className="text-white whitespace-pre-wrap break-words">
              {post.text}
            </p>
            {post.img && (
              <div className="mt-3 rounded-2xl overflow-hidden">
                <img
                  src={post.img}
                  alt="Post content"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between max-w-md">
            <button
              className="flex items-center gap-2 p-2 rounded-full hover:bg-blue-500/20 text-gray-500 hover:text-blue-500 transition-colors"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <FaRegComment className="w-4 h-4" />
              <span className="text-sm">{post.comments.length}</span>
            </button>

            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-green-500/20 text-gray-500 hover:text-green-500 transition-colors">
              <BiRepost className="w-5 h-5" />
              <span className="text-sm">0</span>
            </button>

            <button
              className="flex items-center gap-2 p-2 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-colors"
              onClick={handleLikePost}
            >
              {isLiked ? (
                <FaRegHeart className="w-4 h-4 text-red-500 fill-current" />
              ) : (
                <FaRegHeart className="w-4 h-4" />
              )}
              <span className={`text-sm ${isLiked ? "text-red-500" : ""}`}>
                {post.likes.length}
              </span>
            </button>

            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-blue-500/20 text-gray-500 hover:text-blue-500 transition-colors">
              <FaRegBookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <dialog id={`comments_modal${post._id}`} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Replies</h3>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No replies yet. Be the first to reply! 😉
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={comment.user.profileImg || "/avatar-placeholder.png"}
                      alt={comment.user.fullname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {comment.user.fullname}
                      </span>
                      <span className="text-gray-500">
                        @{comment.user.username}
                      </span>
                    </div>
                    <p className="text-white">{comment.text}</p>
                  </div>
                </div>
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
