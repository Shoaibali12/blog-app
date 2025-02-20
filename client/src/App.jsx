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

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {!token ? (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Signin />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        {/* Private Routes - Only accessible when logged in */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create-blog"
          element={token ? <CreateBlog /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/manage-blogs/:id"
          element={token ? <ManageBlogs /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/edit-blog/:id"
          element={token ? <EditBlog /> : <Navigate to="/login" replace />}
        />

        {/* Catch All Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
