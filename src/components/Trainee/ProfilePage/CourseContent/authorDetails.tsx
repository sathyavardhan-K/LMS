import React from "react";

const AuthorDetails: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-16 flex items-center space-x-6">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <img
          src="https://via.placeholder.com/150" // Replace with actual image URL
          alt="Author's profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {/* Author Info */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">Author</h1>

        {/* Rating with stars */}
        <div className="flex items-center mb-4">
          <span className="text-yellow-500 mr-2">⭐⭐⭐⭐⭐</span>
          <span className="text-gray-500">4.8</span>
        </div>

        {/* Author Name */}
        <p className="text-lg font-semibold text-gray-700">Dave Gray</p>

        {/* Author Position */}
        <p className="text-sm text-gray-500">Senior UI/UX</p>

        {/* About Details */}
        <p className="text-gray-600 mt-2">
          Dave Gray is a passionate Senior UI/UX designer with over 10 years of experience in creating user-centric designs. He has worked on various high-profile projects and continues to inspire others in the design community.
        </p>
      </div>
    </div>
  );
};

export default AuthorDetails;
