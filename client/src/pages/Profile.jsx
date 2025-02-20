import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth); // ✅ Get user data from Redux
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-8 rounded-2xl border border-white border-opacity-30">
        <h2 className="text-3xl font-extrabold text-white text-center">
          👤 Profile
        </h2>
        <p className="text-white text-center mb-6 opacity-80">
          Update your profile information
        </p>

        {message && (
          <p className="text-center text-white bg-gray-800 p-2 rounded-md">
            {message}
          </p>
        )}
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
            disabled
          />

          {/* ✅ Update Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {/* ✅ Back Button (Now Styled to Look Professional) */}
          <button
            type="button" // Prevents it from submitting the form
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

export default Profile;
