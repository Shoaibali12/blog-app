import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginSuccess, logout } from "../redux/authSlice";
import BlogCard from "../components/BlogCard";
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);

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

    if (user) fetchUserBlogs();
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative">
      {/* ✅ Sidebar - Responsive */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-800 w-64 md:relative md:flex z-50`}
      >
        <Sidebar />
      </div>

      {/* ✅ Overlay Effect on Mobile when Sidebar is Open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Main Content */}
      <main
        className={`p-4 transition-all flex flex-col items-center w-full ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {/* ✅ Toggle Button for Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-5.5 left-2  p-2 rounded-md text-white z-50"
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>

        <h1 className="text-left w-10/12 text-3xl md:text-2xl sm:text-lg font-bold">
          Welcome, {user?.name || "User"}
        </h1>

        {/* ✅ Create Blog Button */}
        <div className="mt-6">
          <Link
            to="/create-blog"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition"
          >
            ➕ Create New Blog
          </Link>
        </div>

        {/* ✅ Error Message */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {/* ✅ Blog List Section */}
        <div className="mt-8 flex flex-col items-center justify-center w-full">
          <h2 className="text-2xl font-bold">📝 Your Blogs</h2>

          {blogs.length === 0 ? (
            <p className="text-gray-300 opacity-80 mt-4">
              You have not created any blogs yet.
            </p>
          ) : (
            <div
              className={`flex flex-wrap justify-center gap-8 mt-4 ${
                sidebarOpen ? "md:w-[calc(100%-16rem)]" : "w-full"
              }`}
            >
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
