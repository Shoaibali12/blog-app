import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateBlog from "./pages/CreateBlog";
import ManageBlogs from "./pages/ManageBlogs";
import EditBlog from "./pages/EditBlog";
import ExploreBlogs from "./pages/ExploreBlogs";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUserBlogs from "./pages/ManageUserBlogs";
import Notification from "./components/Notification";
import ViewPost from "./pages/ViewPost";

function App() {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes (Signup & Login) */}
        {!token ? (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Signin />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        {/* ✅ Admin Routes */}
        {token && user?.isAdmin ? (
          <>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/manage-user-blogs/:id"
              element={<ManageUserBlogs />}
            />
            <Route path="/admin/profile" element={<Profile />} />
          </>
        ) : (
          <>
            {/* ✅ User Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/manage-blogs/:id" element={<ManageBlogs />} />
            <Route path="/edit-blog/:id" element={<EditBlog />} />
            <Route path="/explore" element={<ExploreBlogs />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/post/:id" element={<ViewPost />} />
          </>
        )}

        {/* ✅ Catch All Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
