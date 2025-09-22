import { useState } from "react";
import Posts from "../../components/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="min-h-screen border-r border-gray-800">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex">
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors relative ${
              feedType === "forYou"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors relative ${
              feedType === "following"
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Create Post */}
      <CreatePost />

      {/* Posts Feed */}
      <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;
