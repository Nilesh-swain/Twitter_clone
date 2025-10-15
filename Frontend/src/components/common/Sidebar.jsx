import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth.js";
import XSvg from "../svgs/X.jsx";
import toast from "react-hot-toast";
import { MdHomeFilled, MdHome } from "react-icons/md";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { FaUser, FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useState } from "react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    const logoutPromise = logout();
    toast.promise(
      logoutPromise,
      {
        loading: "Logging out...",
        success: "Logged out successfully!",
        error: "Logout failed",
      },
      { id: "logout-toast" }
    );
    try {
      await logoutPromise;
      toast.success("Logout successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1100); // Wait for toast to show (duration is 1000ms)
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: MdHome,
      activeIcon: MdHomeFilled,
    },
    {
      name: "Notifications",
      href: "/notification",
      icon: IoNotificationsOutline,
      activeIcon: IoNotifications,
    },
    {
      name: "Profile",
      href: `/profile/${user?.username}`,
      icon: FaRegUser,
      activeIcon: FaUser,
    },
    {
      name: "Saved",
      href: "/saved",
      icon: BsBookmark,
      activeIcon: BsBookmarkFill,
    },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex flex-col border-r border-gray-800">
      {/* Logo */}
      <div className="p-4">
        <Link to="/" className="inline-block">
          <XSvg className="w-8 h-8 fill-white hover:fill-primary transition-colors" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = isActive(item.href) ? item.activeIcon : item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`twitter-sidebar-item group ${
                    isActive(item.href) ? "active" : ""
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xl font-normal group-hover:font-semibold transition-all">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-gray-800 relative">
          <div
            className="flex items-center justify-between p-3 rounded-full hover:bg-gray-900 transition-colors cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={user?.profileImg || "/avatar-placeholder.png"}
                  alt={user?.fullname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="block">
                <p className="font-semibold text-sm">{user?.fullname}</p>
                <p className="text-gray-500 text-sm">@{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
              >
                <HiOutlineDotsHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-black border border-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={user?.profileImg || "/avatar-placeholder.png"}
                      alt={user?.fullname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user?.fullname}</p>
                    <p className="text-gray-500 text-sm">@{user?.username}</p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FaUser className="w-5 h-5" />
                  <span className="text-sm">View Profile</span>
                </Link>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-900 transition-colors w-full text-left"
                >
                  <BiLogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
