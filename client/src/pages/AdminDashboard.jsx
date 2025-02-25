import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar"; // ✅ Import the new Navbar

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // ✅ Handle User Deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading)
    return <div className="text-center text-white">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4">
      {/* ✅ Admin Navbar */}
      <AdminNavbar />

      {/* ✅ Admin Dashboard Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-6">
        Admin Dashboard
      </h1>

      {error && <p className="text-red-400 text-center mt-4">{error}</p>}

      {/* ✅ User Management Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between"
          >
            {/* ✅ User Info */}
            <div className="flex items-center gap-3">
              <img
                src={user.profilePicture || "https://via.placeholder.com/50"}
                alt="User Avatar"
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border border-gray-500"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* ✅ Manage & Remove Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/admin/manage-user-blogs/${user._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition w-full sm:w-auto text-center"
              >
                Manage Blogs
              </Link>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition w-full sm:w-auto text-center"
              >
                Remove User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
