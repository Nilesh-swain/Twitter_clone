import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import LoginPage from "./pages/auth/login/LoginPage.jsx";
// import VerifyOTPPage from "./pages/auth/VerifyOTPPage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import Notification from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import SavedPage from "./pages/saved/SavedPage.jsx";
import { MdHomeFilled, MdHome } from "react-icons/md";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { FaUser, FaRegUser } from "react-icons/fa";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

// ✅ Import react-hot-toast
import { Toaster } from "react-hot-toast";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  // Show auth pages without sidebar
  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<SignUpPage />} />
      </Routes>
    );
  }

  // No need for redirect since if !user, we show auth pages above

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:block md:w-64 lg:w-72">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-2xl h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/saved" element={<SavedPage />} />
          </Routes>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:block lg:w-80 xl:w-96">
          <RightPanel />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = isActive(item.href) ? item.activeIcon : item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`p-3 transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Global Toaster */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#222",
            color: "#fff",
            fontSize: "1rem",
            borderRadius: "10px",
            padding: "12px 16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          },
          success: { iconTheme: { primary: "#00ba7c", secondary: "#fff" } },
          error: { iconTheme: { primary: "#f4212e", secondary: "#fff" } },
        }}
        containerStyle={{ top: 20 }}
        limit={1}
      />
    </div>
  );
}

export default App;
