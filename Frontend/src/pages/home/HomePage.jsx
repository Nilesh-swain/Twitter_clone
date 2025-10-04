import { useState } from "react";
import Posts from "../../components/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex flex-col h-screen border-r border-gray-800 min-w-[40%] flex-1">
      {/* Header - Fixed at top */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-20 shadow-md">
        <div className="flex">
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors relative ${
              feedType === "forYou"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors relative ${
              feedType === "following"
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8">
        {/* Create Post */}
        <CreatePost />

        {/* Posts Feed */}
        <Posts feedType={feedType} />
      </div>
    </div>
  );
};

export default HomePage;




