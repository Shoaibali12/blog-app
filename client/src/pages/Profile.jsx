import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateUser } from "../redux/authSlice";

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Handle Profile Update (Name & Email)
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

      dispatch(updateUser({ ...user, name: data.name, email: data.email }));
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Image Selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // ✅ Upload Profile Picture
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select an image first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePicture(data.profilePicture);
      dispatch(updateUser({ ...user, profilePicture: data.profilePicture }));
      setMessage("Profile picture updated successfully!");
    } catch (error) {
      setMessage("Failed to upload profile picture.");
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

        {/* ✅ Profile Picture Upload Section */}
        <div className="flex flex-col items-center">
          <img
            src={profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md border-4 border-white"
          />
          <label className="mt-3 text-white cursor-pointer bg-gray-800 px-3 py-1 rounded-lg hover:bg-gray-700">
            Choose Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <button
            type="button"
            onClick={handleUpload}
            className={`mt-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-500 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Picture"}
          </button>
        </div>

        {/* ✅ Profile Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
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

          {/* ✅ Update Profile Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          {/* ✅ Back to Dashboard Button */}
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

export default Profile;
