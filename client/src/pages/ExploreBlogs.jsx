import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "../components/Model";
const ExploreBlogs = () => {
  const { token, user } = useSelector((state) => state.auth); // ✅ Get user from Redux
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBlogs(data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Could not load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  const handleLike = async (blogId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/blogs/like/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlogs(
        blogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: data.likes || [] } : blog
        )
      );
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleComment = async (blogId, comment) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/blogs/comment/${blogId}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  const openLikesModal = (likes) => {
    setSelectedLikes(likes);
    setLikesModalOpen(true);
  };

  const openCommentsModal = (comments) => {
    setSelectedComments(comments);
    setCommentsModalOpen(true);
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

      {error && <p className="text-red-400 text-center mt-4">{error}</p>}

      <div className="flex flex-col items-center gap-8 mt-6">
        {blogs.length > 0 ? (
          blogs.map((blog) => {
            const isLiked = blog.likes?.some((like) => like._id === user?._id);

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
                  {/* Like Section (Left) */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleLike(blog._id)}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        isLiked ? "bg-red-500 shadow-lg" : "bg-gray-200"
                      }`}
                    >
                      <span className="text-2xl">{isLiked ? "❤️" : "🤍"}</span>
                    </button>

                    {/* Show Likes Count (Clickable to open modal) */}
                    <span
                      className="text-gray-700 cursor-pointer hover:underline mt-2"
                      onClick={() => openLikesModal(blog.likes)}
                    >
                      {blog.likes?.length} Likes
                    </span>
                  </div>

                  {/* Comment Section (Right) */}
                  <div className="flex flex-col items-end">
                    <span
                      className="text-gray-700 cursor-pointer hover:underline"
                      onClick={() => openCommentsModal(blog.comments)}
                    >
                      {blog.comments?.length} Comments
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-white text-lg">No blogs available.</p>
        )}
      </div>

      {/* ✅ Likes Modal */}
      <Modal
        isOpen={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        title="People who liked this"
      >
        {selectedLikes.length > 0 ? (
          selectedLikes.map((like) => (
            <div key={like._id} className="flex items-center gap-2 py-2">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${like.name}`}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-bold text-gray-800">{like.name}</span>
            </div>
          ))
        ) : (
          <p>No likes yet</p>
        )}
      </Modal>

      {/* ✅ Comments Modal (FIXED) */}
      <Modal
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        title="Comments"
      >
        {selectedComments.length > 0 ? (
          selectedComments.map((comment, index) => (
            <div key={index} className="flex items-start gap-3 py-2">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.name}`}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-bold text-gray-800">
                  {comment.user?.name || "Unknown"}
                </span>
                <p className="text-gray-600">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </Modal>
    </div>
  );
};

export default ExploreBlogs;
