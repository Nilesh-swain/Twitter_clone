import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner"; // ✅ adjust path if needed

const NotificationPage = () => {
  const isLoading = false;

  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "like",
    },
  ];

  const deleteNotifications = () => {
    toast.success("✅ All notifications deleted");
    // Later: Call backend API to clear notifications
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
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
          </div>
        ))}
    </div>
  );
};

export default NotificationPage;
