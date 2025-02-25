import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar

const ManageBlogs = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [token]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError("Failed to delete blog.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Loading Blogs...
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
        <Sidebar user={user} handleLogout={() => navigate("/login")} />
      </div>

      {/* ✅ Overlay Effect on Mobile when Sidebar is Open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Main Content (Adjust Width When Sidebar is Open) */}
      <main
        className={`p-6 transition-all flex flex-col w-full ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {/* ✅ Toggle Button for Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-5 left-2 p-2 rounded-md text-white z-50"
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>

        {/* ✅ Heading with Top Margin to Push it Down */}
        <h1 className="text-3xl md:text-lg sm:text-base font-bold ml-12 md:ml-6 mt-12 md:mt-6">
          Manage Blogs
        </h1>

        <div className="mt-6 flex justify-center">
          <Link
            to="/create-blog"
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition"
          >
            ➕ Create New Blog
          </Link>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {/* ✅ User's Blogs Section */}
        <div className="mt-8">
          {blogs.length === 0 ? (
            <p className="text-gray-300 mt-4 text-center">
              You have not created any blogs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 lg:ml-12">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-gray-700 shadow-lg p-6 rounded-lg flex flex-col justify-between h-[400px]"
                >
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt="Blog Cover"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-white">{blog.title}</h3>
                  <p className="text-gray-300 opacity-80 mt-2 flex-grow">
                    {blog.content.substring(0, 100)}...
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    {/* ✅ Push Buttons to Bottom */}
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      ❌ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageBlogs;
