import { useState, useEffect } from "react";
import Post from "./Post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
import { postAPI } from "../../utils/api.js";
import { useAuth } from "../../contexts/AuthContext.jsx";

const Posts = ({ feedType = "forYou" }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError("");

        let postsData;
        if (feedType === "following") {
          postsData = await postAPI.getFollowingPosts();
        } else {
          postsData = await postAPI.getAllPosts();
        }

        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    } else {
      setIsLoading(false);
    }
  }, [feedType, user]);

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
        <p className="text-center my-4 text-red-500">{error}</p>
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
