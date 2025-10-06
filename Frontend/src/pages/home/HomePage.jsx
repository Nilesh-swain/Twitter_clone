import { useState } from "react";
import Posts from "../../components/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex flex-col h-full border-l border-r border-gray-700 bg-[#0f0f10]">
      {/* Header - Fixed at top */}
      <div className="sticky top-0 bg-black border-b border-gray-700 z-10">
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
      <div className="flex-1 px-4 sm:px-6 md:px-8">
        {/* Create Post */}
        <CreatePost />

        {/* Posts Feed */}
        <Posts feedType={feedType} />
      </div>
    </div>
  );
};

export default HomePage;




