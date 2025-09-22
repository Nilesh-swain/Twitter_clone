import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";

const RightPanel = () => {
  const isLoading = false;

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Twitter"
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* What's happening */}
      <div className="twitter-card">
        <h2 className="text-xl font-bold mb-4">What's happening</h2>
        <div className="space-y-3">
          <div className="hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors">
            <p className="text-sm text-gray-500">Trending in Technology</p>
            <p className="font-semibold">React 19</p>
            <p className="text-sm text-gray-500">125K posts</p>
          </div>
          <div className="hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors">
            <p className="text-sm text-gray-500">Trending in Programming</p>
            <p className="font-semibold">TypeScript</p>
            <p className="text-sm text-gray-500">89K posts</p>
          </div>
          <div className="hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors">
            <p className="text-sm text-gray-500">Trending in Web Dev</p>
            <p className="font-semibold">Tailwind CSS</p>
            <p className="text-sm text-gray-500">67K posts</p>
          </div>
        </div>
        <button className="text-primary hover:underline text-sm mt-3">
          Show more
        </button>
      </div>

      {/* Who to follow */}
      <div className="twitter-card">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        <div className="space-y-3">
          {isLoading ? (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          ) : (
            USERS_FOR_RIGHT_PANEL?.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between hover:bg-gray-800 p-3 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user.profileImg || "/avatar-placeholder.png"}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user.fullName}</p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                  </div>
                </div>
                <button
                  className="twitter-button px-4 py-1.5 text-sm font-semibold"
                  onClick={(e) => e.preventDefault()}
                >
                  Follow
                </button>
              </div>
            ))
          )}
        </div>
        <button className="text-primary hover:underline text-sm mt-3">
          Show more
        </button>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Cookie Policy
          </a>
          <a href="#" className="hover:underline">
            Accessibility
          </a>
          <a href="#" className="hover:underline">
            Ads info
          </a>
          <a href="#" className="hover:underline">
            More...
          </a>
        </div>
        <p>© 2024 Twitter Clone</p>
      </div>
    </div>
  );
};
export default RightPanel;
