import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL or file path for blog image
      default: "",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId], // ✅ Array of user IDs
      ref: "User",
      default: [], // ✅ Default to an empty array
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
