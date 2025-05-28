import React, { useState, useRef } from "react";

const MyAccount = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "User", // or whatever role
  });

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file chosen");

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      console.log("Selected file:", file.name);
      // Add upload logic here if needed
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditMode(false);
    console.log("Saved:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">My Account</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 w-full p-2 border rounded ${
                editMode ? "border-blue-400" : "bg-gray-100 border-gray-200"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 w-full p-2 border rounded ${
                editMode ? "border-blue-400" : "bg-gray-100 border-gray-200"
              }`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
              className={`mt-1 w-full p-2 border rounded ${
                editMode ? "border-blue-400" : "bg-gray-100 border-gray-200"
              }`}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="mt-1 w-full p-2 border rounded bg-gray-100 border-gray-200"
            />
          </div>

          {/* File Upload Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBrowseClick}
                disabled={!editMode}
                className={`px-4 py-2 rounded text-white ${
                  editMode ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Browse
              </button>
              <span className="text-sm text-gray-600">{fileName}</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
