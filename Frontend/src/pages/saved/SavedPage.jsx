import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Post from "../../components/common/Post";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import { postAPI } from "../../utils/api";

const SavedPage = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["bookmarkedPosts"],
    queryFn: () => postAPI.getBookmarkedPosts(),
  });

  return (
    <div className="flex flex-col h-screen border-r border-gray-700 bg-[#0f0f10] text-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 sticky top-0 backdrop-blur-md bg-black/50 border-b border-gray-800 z-20">
        <Link to="/">
          <FaArrowLeft className="w-5 h-5 text-slate-300 hover:text-white transition" />
        </Link>
        <div>
          <h2 className="font-bold text-lg">Saved Posts</h2>
          <p className="text-sm text-slate-400">
            {posts ? posts.length : 0} saved posts
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col justify-center">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts?.length === 0 ? (
          <p className="text-center my-6 text-slate-400">
            No saved posts yet. Start bookmarking posts you like! 📚
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
  );
};

export default SavedPage;
