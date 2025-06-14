import React from "react";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-blue-200 p-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 flex gap-6">
        {/* Profile Form */}
        <div className="bg-gray-100 p-6 rounded-lg space-y-4 w-[500px]">
          <h3 className="text-lg font-semibold mb-2">👤 Profile Information</h3>
          {[...Array(4)].map((_, idx) => (
            <input
              key={idx}
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder={`Field ${idx + 1}`}
            />
          ))}

          <h4 className="font-semibold mt-6">🔒 Change Password</h4>
          {["Current", "New", "Confirm"].map((label, i) => (
            <input
              key={i}
              type="password"
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder={`${label} Password`}
            />
          ))}

          <div className="flex justify-between mt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded">Update Password</button>
            <button className="bg-red-500 text-white px-6 py-2 rounded">Logout</button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="w-80 bg-gray-200 rounded-lg p-4 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="w-24 h-24 bg-gray-400 rounded-full mb-4"></div>
          <div className="flex gap-2 mb-4">
            <button className="bg-gray-300 px-3 py-1 rounded">Update profile picture</button>
            <button className="bg-gray-300 px-3 py-1 rounded">Delete profile picture</button>
          </div>

          {/* Buttons */}
          <div className="space-y-2 w-full">
            <button className="w-full bg-gray-300 px-3 py-2 rounded">Edit Profile</button>
            <button className="w-full bg-gray-300 px-3 py-2 rounded">FAQs</button>
            <button className="w-full bg-gray-300 px-3 py-2 rounded">Account Settings</button>
            <button className="w-full bg-gray-300 px-3 py-2 rounded">About Us</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
