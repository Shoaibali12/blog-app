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
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
