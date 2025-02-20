import React, { useState } from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const [expanded, setExpanded] = useState(false); // ✅ Read More State

  return (
    <div className="w-full md:w-[600px] lg:w-[700px] bg-white bg-opacity-25 backdrop-blur-lg shadow-lg p-6 rounded-lg">
      {blog.image && (
        <img
          src={blog.image}
          alt="Blog Cover"
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-2xl font-bold text-black">{blog.title}</h3>

      <p className="text-gray-800 opacity-80 mt-2 text-lg">
        {expanded ? blog.content : `${blog.content.substring(0, 150)}...`}
      </p>

      {/* ✅ Read More / Read Less Toggle */}
      {blog.content.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 font-bold mt-2 hover:underline text-lg"
        >
          {expanded ? "Read Less" : "Read More →"}
        </button>
      )}
    </div>
  );
};

export default BlogCard;
