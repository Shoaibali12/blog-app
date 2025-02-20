import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams(); // ✅ Get blog ID from URL
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch existing blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/blogs/${id}`
        );
        setTitle(data.title);
        setContent(data.content);
        setImage(data.image || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setMessage("Error loading blog details.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // ✅ Handle Blog Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Blog updated successfully!");
      setTimeout(() => navigate("/manage-blogs"), 1500); // ✅ Redirect after success
    } catch (error) {
      console.error("Error updating blog:", error);
      setMessage("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Blog...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-lg bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-8 rounded-2xl border border-white border-opacity-30">
        <h2 className="text-3xl font-extrabold text-white text-center">
          ✏️ Edit Blog
        </h2>
        <p className="text-white text-center mb-6 opacity-80">
          Modify your blog post
        </p>

        {message && (
          <p className="text-center text-white bg-gray-800 p-2 rounded-md">
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
            required
          />
          <textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 h-40 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
            required
          />
          <input
            type="text"
            placeholder="Image URL (Optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
          />

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>

          {/* 🔙 Back Button */}
          <button
            type="button"
            onClick={() => navigate("/manage-blogs")}
            className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            ← Back to Manage Blogs
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
