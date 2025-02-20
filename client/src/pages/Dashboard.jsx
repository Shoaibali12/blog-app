import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-6 border-r border-white border-opacity-30 hidden md:block">
        <h2 className="text-2xl font-bold text-white">Blog Dashboard</h2>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="text-white hover:text-gray-300 transition"
              >
                🏠 Home
              </Link>
            </li>
            <li>
              <Link
                to="/create-blog"
                className="text-white hover:text-gray-300 transition"
              >
                📝 Create Blog
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-white hover:text-gray-300 transition"
              >
                👤 Profile
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="text-white hover:text-gray-300 transition"
              >
                🚪 Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
        <p className="opacity-80">Manage your blogs and create new content!</p>

        {/* Create Blog Button */}
        <div className="mt-6">
          <Link
            to="/create-blog"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            ➕ Create New Blog
          </Link>
        </div>

        {/* Recent Blog Posts */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold">📢 Recent Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* Sample Blog Card */}
            <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-4 rounded-lg">
              <h3 className="text-xl font-bold">📖 Blog Title</h3>
              <p className="opacity-80 mt-2">
                Short description of the blog post...
              </p>
              <Link
                to="/blog/1"
                className="text-blue-200 hover:underline mt-2 inline-block"
              >
                Read More →
              </Link>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg p-4 rounded-lg">
              <h3 className="text-xl font-bold">📖 Blog Title</h3>
              <p className="opacity-80 mt-2">
                Short description of the blog post...
              </p>
              <Link
                to="/blog/2"
                className="text-blue-200 hover:underline mt-2 inline-block"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
