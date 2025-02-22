import express from "express";
import {
  getAllUsers,
  deleteUser,
  getUserBlogs,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminAuth } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ✅ Admin-Only Routes
router.get("/users", protect, adminAuth, getAllUsers); // See all users
router.delete("/users/:id", protect, adminAuth, deleteUser); // Delete user
router.get("/users/:id/blogs", protect, adminAuth, getUserBlogs); // Get user’s blogs

export default router;
