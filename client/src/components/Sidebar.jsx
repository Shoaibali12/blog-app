import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      className="w-64 bg-gray-800 text-white shadow-lg p-6 border-r border-gray-800 
                     fixed top-0 left-0 h-screen overflow-y-auto"
    >
      <h2 className="text-2xl md:text-xl sm:text-lg font-bold text-white mb-6 ml-4 md:ml-8">
        Blog Dashboard
      </h2>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user?.profilePicture || "http://localhost:5000/images/user.png"}
          alt="User Avatar"
          className="w-12 h-12 rounded-full border border-gray-600 object-cover"
        />
        <p className="text-gray-400 text-lg">{user?.name || "User"}</p>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              🏠 Home
            </Link>
          </li>
          <li>
            <Link
              to="/explore"
              className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              🌍 Explore
            </Link>
          </li>
          <li>
            <Link
              to="/create-blog"
              className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              📝 Create Blog
            </Link>
          </li>
          <li>
            <Link
              to={`/manage-blogs/${user?._id}`}
              className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              📂 Manage Blogs
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              👤 Profile
            </Link>
          </li>

          {/* ✅ Notifications Button (Redirects to Notifications Page) */}
          <li>
            <Link
              to="/notifications"
              className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded-lg transition relative w-full"
            >
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          </li>
          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 text-lg hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
