import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout, loginSuccess } from "../redux/authSlice"; // ✅ Import loginSuccess for updating Redux state

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth); // ✅ Get user & token from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        console.error("No token found! Redirecting to login...");
        navigate("/login"); // ✅ Redirect if no token
        return;
      }

      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(loginSuccess({ user: data, token })); // ✅ Save user to Redux (if needed)
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Session expired! Please login again.");
        dispatch(logout()); // ✅ Logout on failed token
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchUserProfile(); // ✅ Fetch user only if not in Redux
    else setLoading(false);
  }, [user, token, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout()); // ✅ Clear Redux state & token
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-lg p-6 border-r border-gray-800 hidden md:block">
        <h2 className="text-2xl font-bold text-white mb-6">
          📌 Blog Dashboard
        </h2>
        <p className="text-gray-400">Welcome, {user?.name || "User"} 👋</p>
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
                to="/create-blog"
                className="flex items-center gap-3 text-lg hover:bg-gray-700 px-4 py-2 rounded-lg transition"
              >
                📝 Create Blog
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

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name || "User"} 🎉
        </h1>
        <p className="opacity-80">Manage your blogs and create new content!</p>

        {/* Create Blog Button */}
        <div className="mt-6">
          <Link
            to="/create-blog"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            ➕ Create New Blog
          </Link>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {/* Recent Blog Posts */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">📢 Recent Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="bg-white bg-opacity-25 backdrop-blur-lg shadow-lg p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold text-black">
                  📖 Blog Title {id}
                </h3>
                <p className="text-gray-800 opacity-80 mt-2">
                  Short description of the blog post...
                </p>
                <Link
                  to={`/blog/${id}`}
                  className="text-blue-900 hover:underline mt-2 inline-block font-bold"
                >
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
