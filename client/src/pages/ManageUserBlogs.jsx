import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const ManageUserBlogs = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/admin/users/${id}/blogs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBlogs(data);
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [id, token]);

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  if (loading)
    return <div className="text-center text-white">Loading blogs...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">User's Blogs</h1>

      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{blog.title}</h2>
            <p className="text-gray-400">{blog.content.substring(0, 100)}...</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleDeleteBlog(blog._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete Blog
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mt-6 block mx-auto bg-gray-700 text-white px-4 py-2 rounded-md"
      >
        Back to Admin Dashboard
      </button>
    </div>
  );
};

export default ManageUserBlogs;
