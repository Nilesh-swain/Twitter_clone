import { useState } from "react";
import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../../utils/api.js";
import useFollowUnfollow from "../../hooks/usefollow";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: userAPI.getSuggestions,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { followUnfollow } = useFollowUnfollow();

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Enhanced search: split query into words and search by username or fullname containing any word
      const words = query.trim().split(/\s+/);
      const combinedResults = new Map();

      for (const word of words) {
        const results = await userAPI.searchUsers(word);
        results.forEach(user => {
          if (!combinedResults.has(user._id)) {
            combinedResults.set(user._id, user);
          }
        });
      }

      setSearchResults(Array.from(combinedResults.values()));
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-4 space-y-6">
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
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="twitter-card">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="space-y-3">
            {isSearching ? (
              <p className="text-gray-500 text-sm">Searching...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between hover:bg-gray-800 p-3 rounded-lg transition-colors"
                >
                  <Link
                    to={`/profile/${user.username}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt={user.fullName || user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">
                        {user.fullname} <span className="text-gray-400 ml-2">@{user.username}</span>
                      </p>
                      <p className="text-gray-500 text-sm"></p>
                    </div>
                  </Link>
                  <button
                    className="twitter-button px-4 py-1.5 text-sm font-semibold ml-2"
                    onClick={(e) => {
                      e.preventDefault();
                      followUnfollow(user._id);
                    }}
                  >
                    Follow
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No users found</p>
            )}
          </div>
        </div>
      )}

      {/* What's happening */}
      {!searchQuery && (
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
      )}

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
          ) : suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between hover:bg-gray-800 p-3 rounded-lg transition-colors"
              >
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user.profileImg || "/avatar-placeholder.png"}
                      alt={user.fullName || user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">
                      {user.fullname}
                    </p>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                  </div>
                </Link>
                <button
                  className="twitter-button px-4 py-1.5 text-sm font-semibold"
                  onClick={() => followUnfollow(user._id)}
                >
                  Follow
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No suggestions right now</p>
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
