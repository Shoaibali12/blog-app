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
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Blogs...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ✅ Sidebar Added */}
      <Sidebar user={user} handleLogout={() => navigate("/login")} />

      {/* Manage Blogs Content */}
      <main className="ml-64 flex-1 p-6 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold">📝 Manage Your Blogs</h1>
        <p className="opacity-80">Edit or delete your blogs here</p>

        <div className="mt-6 flex justify-end">
          <Link
            to="/create-blog"
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition"
          >
            ➕ Create New Blog
          </Link>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {/* User's Blogs */}
        <div className="mt-8">
          {blogs.length === 0 ? (
            <p className="text-white opacity-80 mt-4 text-center">
              You have not created any blogs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white bg-opacity-25 backdrop-blur-lg shadow-lg p-6 rounded-lg 
                     flex flex-col justify-between h-[400px]" // ✅ Fixed Height
                >
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt="Blog Cover"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-black">{blog.title}</h3>
                  <p className="text-gray-800 opacity-80 mt-2 flex-grow">
                    {blog.content.substring(0, 100)}...
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    {" "}
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
