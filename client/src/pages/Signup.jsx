import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", user);
    // API request can be added here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-8 rounded-2xl border border-white border-opacity-30">
        <h2 className="text-3xl font-extrabold text-white text-center">
          Create Your Account
        </h2>
        <p className="text-white text-center mb-6 opacity-80">
          Join our blog community today!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
              required
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-30 text-white placeholder-white focus:ring-2 focus:ring-white outline-none transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg shadow-md hover:opacity-90 transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <p className="text-white text-center mt-4 opacity-80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold underline hover:text-gray-200 transition duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
