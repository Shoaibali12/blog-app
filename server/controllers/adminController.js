import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Blog from "../models/blogModel.js";

/**
 * @desc Get all users (Admin Only)
 * @route GET /api/admin/users
 * @access Private (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false }).select("-password"); // ✅ Exclude admin & passwords
  res.json(users);
});

/**
 * @desc Delete a user & their blogs (Admin Only)
 * @route DELETE /api/admin/users/:id
 * @access Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await Blog.deleteMany({ user: req.params.id }); // ✅ Delete user's blogs
  await user.deleteOne(); // ✅ Delete user

  res.json({ message: "User deleted successfully" });
});

/**
 * @desc Get all blogs of a specific user (Admin Only)
 * @route GET /api/admin/users/:id/blogs
 * @access Private (Admin)
 */
const getUserBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ user: req.params.id }).populate(
    "user",
    "name profilePicture"
  );
  res.json(blogs);
});

export { getAllUsers, deleteUser, getUserBlogs };
