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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6">
      <div className="w-full max-w-lg bg-gray-800 bg-opacity-90 backdrop-blur-lg shadow-xl p-8 rounded-xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-gray-100 text-center">
          📝 Create Blog
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Share your thoughts with the world!
        </p>

        {message && (
          <p
            className={`text-center text-sm p-2 rounded-md ${
              message.includes("✅")
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
          <textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 h-40 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
          <input
            type="text"
            placeholder="Image URL (Optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 hover:bg-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Publishing Blog..." : "Publish Blog"}
          </button>

          {/* 🔙 Back Button */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gray-700 text-gray-200 font-bold py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 transform hover:scale-105"
          >
            ← Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
