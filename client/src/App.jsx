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

function App() {
  const { token } = useSelector((state) => state.auth); // ✅ Get auth token from Redux

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
          <Route path="*" element={<Navigate to="/" replace />} /> // ✅ Redirect logged-in users away from signup/login
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

        {/* Catch All Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
