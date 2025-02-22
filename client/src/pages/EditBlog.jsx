import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const EditBlog = () => {
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
      setTimeout(() => navigate("/manage-blogs"), 1500);
    } catch (error) {
      console.error("Error updating blog:", error);
      setMessage("Failed to update blog.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Loading Blog...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <main className=" flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-gray-800 shadow-lg p-8 rounded-2xl border border-gray-700">
          <h2 className="text-3xl font-extrabold text-white text-center">
            ✏️ Edit Blog
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Modify your blog post
          </p>

          {message && (
            <p className="text-center text-white bg-gray-700 p-2 rounded-md">
              {message}
            </p>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
              required
            />
            <textarea
              placeholder="Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 h-40 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
              required
            />
            <input
              type="text"
              placeholder="Image URL (Optional)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
            />

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>

            {/* 🔙 Back Button */}
            <button
              type="button"
              onClick={() => navigate("/manage-blogs")}
              className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
            >
              ← Back to Dashboard
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditBlog;
