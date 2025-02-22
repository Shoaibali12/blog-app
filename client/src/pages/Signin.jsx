import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
        user
      );

      // ✅ Save user in Redux
      dispatch(loginSuccess(data));

      // ✅ Redirect based on role
      if (data.user.isAdmin) {
        navigate("/admin/dashboard"); // Redirect admin users
      } else {
        navigate("/dashboard"); // Redirect normal users
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 shadow-lg p-8 rounded-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Welcome Back
        </h2>
        <p className="text-gray-300 text-center mb-6">Login to your account</p>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
            required
          />
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-300 text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-blue-400 hover:text-blue-300 transition duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
