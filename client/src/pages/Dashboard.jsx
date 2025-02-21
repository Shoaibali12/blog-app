import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout, loginSuccess } from "../redux/authSlice";
import BlogCard from "../components/BlogCard";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]); // ✅ Store user's blogs

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(loginSuccess({ user: data, token }));
      } catch (err) {
        setError("Session expired! Please login again.");
        dispatch(logout());
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchUserProfile();
    else setLoading(false);
  }, [user, token, navigate, dispatch]);

  // ✅ Fetch User's Own Blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/blogs/my-blogs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Could not load blogs.");
      }
    };

    if (user) fetchUserBlogs(); // ✅ Fetch blogs only if user is available
  }, [user, token]);

  const handleLogout = () => {
    dispatch(logout());
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
        <h2 className="text-2xl font-bold text-white mb-6">Blog Dashboard</h2>
        <p className="text-gray-400"> {user?.name || "User"} </p>
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
                to={`/manage-blogs/${user?._id}`} // ✅ Pass user ID dynamically
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

        {/* User's Blogs */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">📝 Your Blogs</h2>

          {blogs.length === 0 ? (
            <p className="text-white opacity-80 mt-4">
              You have not created any blogs yet.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 mt-4">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
