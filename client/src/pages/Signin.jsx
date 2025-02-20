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
      dispatch(loginSuccess(data)); // ✅ Save user in Redux
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-8 rounded-2xl border border-white border-opacity-30">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Welcome Back
        </h2>
        <p className="text-white text-center mb-6 opacity-80">
          Login to your account
        </p>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
            required
          />
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Sign In"}
          </button>
        </form>

        <p className="text-white text-center mt-4 opacity-80">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold underline hover:text-gray-200 transition duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
