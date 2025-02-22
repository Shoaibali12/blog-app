import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const AdminNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src={user?.profilePicture || "https://via.placeholder.com/50"}
          alt="Admin Avatar"
          className="w-12 h-12 rounded-full border"
        />
        <span className="text-lg font-bold text-white">
          {user?.name || "Admin"}
        </span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/admin/profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
        >
          Update Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
