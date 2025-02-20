import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const CreateBlog = () => {
  const { token } = useSelector((state) => state.auth); // ✅ Get auth token from Redux
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/blogs",
        { title, content, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Blog created successfully!");
      setTimeout(() => navigate("/dashboard"), 2000); // ✅ Redirect to dashboard after success
    } catch (error) {
      setMessage("Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-lg bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-8 rounded-2xl border border-white border-opacity-30">
        <h2 className="text-3xl font-extrabold text-white text-center">
          📝 Create Blog
        </h2>
        <p className="text-white text-center mb-6 opacity-80">
          Share your thoughts with the world!
        </p>

        {message && (
          <p className="text-center text-white bg-gray-800 p-2 rounded-md">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Creating Blog..." : "Publish Blog"}
          </button>

          {/* 🔙 Back Button */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            ← Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
