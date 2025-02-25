import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const AdminNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center">
      {/* ✅ Left Side: Profile */}
      <div className="flex items-center gap-3">
        <img
          src={user?.profilePicture || "https://via.placeholder.com/50"}
          alt="Admin Avatar"
          className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border"
        />
        <span className="text-base sm:text-lg font-bold text-white">
          {user?.name || "Admin"}
        </span>
      </div>

      {/* ✅ Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden text-white text-2xl"
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* ✅ Right Side: Buttons (Dropdown on Small, Inline on Larger Screens) */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-2 sm:gap-4 absolute sm:static top-16 right-4 w-44 sm:w-auto bg-gray-800 sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none shadow-lg sm:shadow-none`}
      >
        <button
          onClick={() => navigate("/admin/profile")}
          className="w-full sm:w-40 text-white font-semibold py-2.5 rounded-md shadow-md hover:bg-blue-700 transition duration-300 focus:ring-2 focus:ring-blue-400"
        >
          Update Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full sm:w-40 b text-white font-semibold py-2.5 rounded-md shadow-md hover:bg-red-700 transition duration-300 focus:ring-2 focus:ring-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
