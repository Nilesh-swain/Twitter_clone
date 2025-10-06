import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner"; // ✅ adjust path if needed
import { useState, useEffect } from "react";
import { notificationAPI } from "../../utils/api";

const NotificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationAPI.getNotifications();
      setNotifications(data);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const deleteNotifications = async () => {
    try {
      await notificationAPI.deleteAllNotifications();
      setNotifications([]);
      toast.success("All notifications deleted");
    } catch {
      toast.error("Failed to delete notifications");
    }
  };

  const deleteSingleNotification = async (id) => {
    try {
      await notificationAPI.deleteSingleNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="flex flex-col h-screen border-l border-r border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-black z-10">
        <p className="font-bold text-lg">Notifications</p>
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
            <IoSettingsOutline className="w-5 h-5 text-gray-300" />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
          >
            <li>
              <button onClick={deleteNotifications}>🗑 Delete all</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && notifications?.length === 0 && (
        <div className="text-center p-6 text-gray-400 font-medium">
          No notifications 🤔
        </div>
      )}

      {/* Notifications list */}
      {!isLoading &&
        notifications?.map((notification) => (
          <div
            key={notification._id}
            className="flex items-center gap-3 p-4 border-b border-gray-700 hover:bg-gray-900/40 transition"
          >
            {/* Icon */}
            {notification.type === "follow" && (
              <FaUser className="w-6 h-6 text-primary shrink-0" />
            )}
            {notification.type === "like" && (
              <FaHeart className="w-6 h-6 text-red-500 shrink-0" />
            )}

            {/* Avatar + text */}
            <Link
              to={`/profile/${notification.from.username}`}
              className="flex items-center gap-2 flex-1"
            >
              <div className="avatar">
                <div className="w-9 h-9 rounded-full overflow-hidden">
                  <img
                    src={
                      notification.from.profileImg || "/avatar-placeholder.png"
                    }
                    alt={`${notification.from.username} avatar`}
                  />
                </div>
              </div>
              <div className="text-sm">
                <span className="font-bold">@{notification.from.username}</span>{" "}
                {notification.type === "follow"
                  ? "followed you"
                  : "liked your post"}
              </div>
            </Link>
            <button
              onClick={() => deleteSingleNotification(notification._id)}
              className="btn btn-sm btn-error ml-2"
              title="Delete notification"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
