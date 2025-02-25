import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm transition-opacity duration-300 px-4">
      <div className="bg-white w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-xl transform transition-all scale-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Modal Title */}
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 text-center border-b pb-2">
          {title}
        </h2>

        {/* Modal Content */}
        <div className="max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
