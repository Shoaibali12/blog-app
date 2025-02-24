import React, { useState } from "react";

const BlogCard = ({ blog }) => {
  const [expanded, setExpanded] = useState(false); // ✅ Read More State

  return (
    <div className="w-full sm:w-[90%] md:w-[600px] lg:w-[700px] bg-gray-700 shadow-lg p-6 rounded-lg">
      {/* ✅ Blog Image (Responsive Height) */}
      {blog.image && (
        <img
          src={blog.image}
          alt="Blog Cover"
          className="w-full h-40 sm:h-48 md:h-60 object-cover rounded-lg mb-4"
        />
      )}

      {/* ✅ Blog Title (Responsive Size) */}
      <h3 className="text-xl md:text-2xl font-bold text-white">{blog.title}</h3>

      {/* ✅ Blog Content (Responsive Font) */}
      <p className="text-gray-300 opacity-80 mt-2 text-base md:text-lg">
        {expanded ? blog.content : `${blog.content.substring(0, 150)}...`}
      </p>

      {/* ✅ Read More / Read Less Toggle */}
      {blog.content.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-400 font-bold mt-2 hover:underline text-base md:text-lg"
        >
          {expanded ? "Read Less" : "Read More →"}
        </button>
      )}
    </div>
  );
};

export default BlogCard;
