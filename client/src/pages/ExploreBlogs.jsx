import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const ExploreBlogs = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [blogs, setBlogs] = useState([]); // ✅ Ensure it's always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(data || []); // ✅ Ensure data is an array
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Could not load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  // ✅ Handle Like Toggle
  const handleLike = async (blogId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/blogs/like/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Update UI with new like status
      setBlogs(
        blogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: data.likes || [] } : blog
        )
      );
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  // ✅ Handle Comment Submission
  const handleComment = async (blogId, comment) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/blogs/comment/${blogId}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update UI with new comment
      setBlogs(
        blogs.map((blog) =>
          blog._id === blogId
            ? { ...blog, comments: data.comments || [] }
            : blog
        )
      );
    } catch (err) {
      console.error("Error commenting on blog:", err);
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
      <h1 className="text-3xl font-bold text-center">🌍 Explore Blogs</h1>
      <p className="opacity-80 text-center">See what others are posting!</p>

      {/* Error Message */}
      {error && <p className="text-red-400 text-center mt-4">{error}</p>}

      {/* Blog Feed */}
      <div className="flex flex-col items-center gap-8 mt-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => {
            const isLiked = blog.likes?.includes(user?._id); // ✅ Check if the current user has liked the blog

            return (
              <div
                key={blog._id}
                className="w-full max-w-2xl bg-white bg-opacity-25 backdrop-blur-lg shadow-lg p-6 rounded-lg"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt="Blog Cover"
                    className="w-full h-60 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-2xl font-bold text-black">{blog.title}</h3>
                <p className="text-gray-800 opacity-80 mt-2">
                  {blog.content.substring(0, 150)}...
                </p>

                {/* Like & Comment Section */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => handleLike(blog._id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isLiked
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white text-black"
                    }`}
                  >
                    <span className="text-xl">❤️</span>
                    {blog.likes?.length || 0}
                  </button>
                  <span className="text-gray-700">
                    {blog.comments?.length || 0} Comments
                  </span>
                </div>

                {/* Comment Section */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-50 text-black placeholder-black focus:ring-2 focus:ring-white outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleComment(blog._id, e.target.value);
                    }}
                  />
                </div>

                {/* Show Comments */}
                <div className="mt-4">
                  {blog.comments?.slice(0, 3).map((comment, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      <strong>{comment.user?.name || "Anonymous"}</strong>:{" "}
                      {comment.text}
                    </p>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-white text-lg">
            No blogs available. Be the first to post!
          </p>
        )}
      </div>
    </div>
  );
};

export default ExploreBlogs;
