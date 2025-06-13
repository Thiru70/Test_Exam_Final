import React from "react";

const ProfileForm = () => {
  return (
    <div className="bg-gray-100 p-6 md:p-10">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 px-6 rounded-t-lg flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profile</h2>
        <button className="bg-white text-blue-600 font-medium px-4 py-1 rounded hover:bg-gray-100">
          Edit
        </button>
      </div>

      {/* Profile Info */}
      <div className="p-6 flex flex-col md:flex-row items-start gap-6 bg-white rounded-b-lg shadow-md">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="rounded-full w-20 h-20 object-cover"
          />
          <div className="text-center mt-2">
            <h3 className="text-md font-semibold">User name</h3>
            <p className="text-sm text-gray-500">username@gmail.com</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter here"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">user Name</label>
            <input
              type="text"
              placeholder="Enter here"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <input
              type="text"
              placeholder="Enter here"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              placeholder="Enter here"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <input
              type="text"
              placeholder="Enter here"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Zone</label>
            <input
              type="text"
              placeholder="Enter here"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="px-6 pt-4 pb-2 bg-white mt-6 rounded-lg shadow-sm">
        <p className="font-semibold text-sm text-gray-700 mb-2">My email Address</p>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-blue-600">@</span>
          username@gmail.com <span className="text-gray-400 ml-2">1 month ago</span>
        </div>
        <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
          + Add Email Address
        </button>
      </div>

      {/* Logout */}
      <div className="flex justify-end mt-6">
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          logout
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
