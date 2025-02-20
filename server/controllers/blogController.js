import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";

const createBlog = asyncHandler(async (req, res) => {
  console.log("📩 Received request to create a blog");
  console.log("🔑 User from request:", req.user);

  const { title, content, image } = req.body;
  console.log("📝 Blog Data:", { title, content, image });

  if (!title || !content) {
    console.log("🚨 Missing title or content");
    res.status(400);
    throw new Error("Title and content are required");
  }

  const blog = await Blog.create({
    user: req.user._id,
    title,
    content,
    image,
  });

  console.log("✅ Blog successfully created:", blog);

  res.status(201).json(blog);
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate("user", "name email");
  res.json(blogs);
});

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error("Blog not found");
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Check if the logged-in user is the blog's author
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to update this blog");
  }

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  blog.image = req.body.image || blog.image;

  const updatedBlog = await blog.save();
  res.json(updatedBlog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Check if the logged-in user is the blog's author
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to delete this blog");
  }

  await blog.deleteOne();
  res.json({ message: "Blog deleted successfully" });
});

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
