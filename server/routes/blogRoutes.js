import express from "express";
import {
  createBlog,
  getAllBlogs,
  getUserBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentOnBlog,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a blog (protected) & Get all blogs (public)
router.route("/").post(protect, createBlog).get(getAllBlogs);

// ✅ Get all blogs by logged-in user (protected)
router.get("/my-blogs", protect, getUserBlogs);

router.put("/like/:id", protect, likeBlog);
router.post("/comment/:id", protect, commentOnBlog);

// ✅ Get, Update, Delete a blog by ID (Update/Delete are protected)
router
  .route("/:id")
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

export default router;
