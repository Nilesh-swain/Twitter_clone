import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import XSvg from "../svgs/X.jsx";

import { MdHomeFilled, MdHome } from "react-icons/md";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { FaUser, FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
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
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between p-3 rounded-full hover:bg-gray-900 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={user?.profileImg || "/avatar-placeholder.png"}
                  alt={user?.fullname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:block">
                <p className="font-semibold text-sm">{user?.fullname}</p>
                <p className="text-gray-500 text-sm">@{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden lg:block p-1 rounded-full hover:bg-gray-800 transition-colors">
                <HiOutlineDotsHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                title="Logout"
              >
                <BiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
