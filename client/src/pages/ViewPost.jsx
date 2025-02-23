import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { markNotificationAsRead } from "../redux/notificationSlice";

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/blogs/${id}`
        );
        console.log("📢 Blog Data:", data); // ✅ Debugging Log
        setPost(data);

        if (location.state?.notificationId) {
          dispatch(markNotificationAsRead(location.state.notificationId));
        }
      } catch (err) {
        setError("Blog post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, dispatch, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Loading Post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-gray-900">
        {error}
      </div>
    );
  }

  // ✅ Fix Profile Picture Handling
  const profilePicture =
    post.user?.profilePicture && post.user.profilePicture.startsWith("http")
      ? post.user.profilePicture
      : "https://via.placeholder.com/50";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 mt-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={profilePicture}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border border-gray-600 object-cover"
            crossOrigin="anonymous" // ✅ Helps with CORS issues
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/50"; // ✅ Handle Broken Image URLs
            }}
          />
          <div>
            <h3 className="text-xl font-bold">
              {post.user?.name || "Unknown Author"}
            </h3>
            <p className="text-sm text-gray-400">
              Published on {moment(post.createdAt).format("D MMMM YYYY")}
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
        {post.image && (
          <img
            src={post.image}
            alt="Blog Cover"
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
        )}
        <p className="text-lg text-gray-300">{post.content}</p>

        <p className="text-sm text-gray-400 mt-6">
          Posted on {moment(post.createdAt).format("D MMMM YYYY")}
        </p>
      </div>
    </div>
  );
};

export default ViewPost;
