import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel.js";
import Notification from "../models/Notification.js";

const createBlog = asyncHandler(async (req, res) => {
  console.log("📩 Received request to create a blog");

  const { title, content, image } = req.body;
  console.log("📝 Blog Data:", { title, content, image });

  if (!title || !content) {
    console.log("🚨 Missing title or content");
    res.status(400);
    throw new Error("Title and content are required");
  }

  try {
    const blog = await Blog.create({
      user: req.user._id,
      title,
      content,
      image,
    });

    console.log("✅ Blog successfully created:", blog);
    res.status(201).json(blog);
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "name email profilePicture")
      .populate("likes", "name profilePicture")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500);
    throw new Error("Failed to fetch blogs");
  }
});

const getUserBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!blogs || blogs.length === 0) {
      res.status(404);
      throw new Error("No blogs found for this user.");
    }

    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching user blogs:", error);
    res.status(500);
    throw new Error("Failed to fetch user blogs");
  }
});

const getBlogById = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "name email profilePicture"
    );

    if (blog) {
      res.json(blog);
    } else {
      res.status(404);
      throw new Error("Blog not found");
    }
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    res.status(500);
    throw new Error("Failed to fetch blog");
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    res.status(500);
    throw new Error("Failed to update blog");
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500);
    throw new Error("Failed to delete blog");
  }
});

// ✅ Like a Blog with Notifications (Improved)
const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "likes",
    "name email"
  );

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const isLiked = blog.likes.some(
    (like) => like._id.toString() === req.user._id.toString()
  );

  if (isLiked) {
    // ✅ Unlike the blog
    blog.likes = blog.likes.filter(
      (like) => like._id.toString() !== req.user._id.toString()
    );

    // ✅ Remove existing notification when unliking
    await Notification.findOneAndDelete({
      user: blog.user,
      fromUser: req.user._id,
      type: "like",
      blogId: blog._id,
    });
  } else {
    // ✅ Like the blog
    blog.likes.push(req.user._id);

    // ✅ Check if a like notification already exists
    const existingNotification = await Notification.findOne({
      user: blog.user,
      fromUser: req.user._id,
      type: "like",
      blogId: blog._id,
    });

    if (
      !existingNotification &&
      blog.user.toString() !== req.user._id.toString()
    ) {
      await Notification.create({
        user: blog.user, // Post owner
        fromUser: req.user._id, // Who liked
        type: "like",
        message: `Your blog "${blog.title}" was liked!`,
        blogId: blog._id,
        isRead: false,
      });
    }
  }

  await blog.save();
  await blog.populate("likes", "name email");

  res.json({ likes: blog.likes });
});

// ✅ Comment on a Blog with Notifications (Improved)
const commentOnBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const newComment = { user: req.user._id, text: req.body.comment };
  blog.comments.push(newComment);

  // ✅ Add a notification only if the commenter is NOT the post owner
  if (blog.user.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: blog.user, // Post owner
      fromUser: req.user._id, // Who commented
      type: "comment",
      message: `Someone commented on your blog "${blog.title}"!`,
      blogId: blog._id,
      isRead: false,
    });
  }

  await blog.save();
  await blog.populate("comments.user", "name email");

  res.json({ comments: blog.comments });
});

export {
  createBlog,
  getAllBlogs,
  getUserBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentOnBlog,
};
