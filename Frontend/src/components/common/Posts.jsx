import { useQuery } from "@tanstack/react-query";
import Post from "./Post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
import { postAPI } from "../../utils/api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const fetchPosts = async (feedType) => {
  if (feedType === "following") {
    return postAPI.getFollowingPosts();
  }
  return postAPI.getAllPosts();
};

const Posts = ({ feedType = "forYou" }) => {
  const { user } = useAuth();

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", feedType, user?._id],
    queryFn: () => fetchPosts(feedType),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to see posts</p>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && error && (
        <p className="text-center my-4 text-red-500">Failed to load posts</p>
      )}
      {!isLoading && !error && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !error && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
