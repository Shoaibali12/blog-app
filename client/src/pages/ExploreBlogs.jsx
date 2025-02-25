import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from "../components/Model";
import { FaPaperPlane } from "react-icons/fa";
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar

const ExploreBlogs = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [newComments, setNewComments] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    if (!comment.trim()) return;

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

      setNewComments({ ...newComments, [blogId]: "" });
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
        <Sidebar />
      </div>
      {/* ✅ Overlay Effect on Mobile when Sidebar is Open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Main Content (Dynamic width based on Sidebar State) */}
      <main
        className={`p-4 transition-all flex flex-col items-center w-full ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {/* ✅ Toggle Button for Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute top-5 left-2  p-2 rounded-md text-white z-50"
        >
          {sidebarOpen ? "✖" : "☰ "}
        </button>

        <h1 className="text-3xl md:text-2xl sm:text-xl font-bold text-center">
          🌍 Explore Blogs
        </h1>
        <p className="opacity-80 text-center text-gray-300">
          See what others are posting!
        </p>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {/* ✅ Blog List */}
        <div className="flex flex-col items-center gap-8 mt-6 w-full">
          {blogs.length > 0 ? (
            blogs.map((blog) => {
              const isLiked = blog.likes?.some(
                (like) => like._id === user?._id
              );

              return (
                <div
                  key={blog._id}
                  className="w-full max-w-2xl bg-gray-800 shadow-lg p-6 rounded-lg"
                >
                  {/* ✅ User Profile Section */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        blog.user?.profilePicture ||
                        "https://via.placeholder.com/50"
                      }
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full border border-gray-600"
                    />
                    <div>
                      <p className="text-lg font-bold text-white">
                        {blog.user?.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(blog.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* ✅ Blog Content */}
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt="Blog Cover"
                      className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-white">
                    {blog.title}
                  </h3>
                  <p className="text-gray-300 opacity-80 mt-2">
                    {blog.content.substring(0, 150)}...
                  </p>

                  {/* ✅ Like & Comment Section */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleLike(blog._id)}
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                          isLiked ? "bg-white-500 shadow-lg" : "bg-gray-700"
                        }`}
                      >
                        <span className="text-2xl">
                          {isLiked ? "❤️" : "🤍"}
                        </span>
                      </button>
                      <span
                        className="text-gray-400 cursor-pointer hover:underline mt-2"
                        onClick={() => openLikesModal(blog.likes)}
                      >
                        {blog.likes?.length} Likes
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className="text-gray-400 cursor-pointer hover:underline mt-2"
                        onClick={() => openCommentsModal(blog.comments)}
                      >
                        {blog.comments?.length} Comments
                      </span>
                    </div>
                  </div>

                  {/* ✅ Comment Input Field */}
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComments[blog._id] || ""}
                      onChange={(e) =>
                        setNewComments({
                          ...newComments,
                          [blog._id]: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-white outline-none"
                    />

                    {/* ✅ Send Button */}
                    <button
                      onClick={() =>
                        handleComment(blog._id, newComments[blog._id])
                      }
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition duration-300"
                    >
                      <FaPaperPlane className="text-lg" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-300 text-lg">
              No blogs available.
            </p>
          )}
        </div>
      </main>
      {/* ✅ Likes Modal */}
      <Modal
        isOpen={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        title="People who liked this"
      >
        {selectedLikes.length > 0 ? (
          selectedLikes.map((like) => (
            <div key={like._id} className="flex items-center gap-3 py-2">
              {/* ✅ Show profile picture in likes */}
              <img
                src={like.profilePicture || "https://via.placeholder.com/50"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <span className="font-bold text-gray-800">{like.name}</span>
            </div>
          ))
        ) : (
          <p>No likes yet</p>
        )}
      </Modal>

      {/* ✅ Comments Modal */}
      <Modal
        isOpen={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        title="Comments"
      >
        {selectedComments.length > 0 ? (
          selectedComments.map((comment, index) => (
            <div key={index} className="flex items-start gap-3 py-2">
              {/* ✅ Show profile picture in comments */}
              <img
                src={
                  comment.user?.profilePicture ||
                  "https://via.placeholder.com/50"
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-300"
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
