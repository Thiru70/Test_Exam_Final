import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const ProfileForm = () => {
  const email = localStorage.getItem("adminEmail");
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfileData = async () => {
    const response = await axiosInstance.get(`/company/profile/${email}`);
    setProfileData(response.data.profile);
  };

  useEffect(() => {
    fetchProfileData();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    if (isEditing) {
      // Save logic (can be a PUT/PATCH API call)
      axiosInstance.put(`/company/profile/${email}`, profileData)
        .then(res => {
          console.log("Saved successfully", res.data);
          window.alert('Successfully updated the profile')
          setIsEditing(false);
        })
        .catch(err => {
          console.error("Save failed", err);
        });
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-gray-100 p-6 md:p-10">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 px-6 rounded-t-lg flex justify-between items-center">
        <div className="w-full flex justify-between">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button
            onClick={handleEditClick}
            className="bg-white text-blue-600 font-medium px-4 py-1 rounded hover:bg-gray-100"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6 flex flex-col md:flex-row items-start gap-6 bg-white rounded-b-lg shadow-md">
        <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {[
            { label: "First Name", name: "first_name" },
            { label: "Last Name", name: "last_name" },
            { label: "Email", name: "email", readOnly: true },
            { label: "Position", name: "position" },
            { label: "Company Name", name: "company_name" },
            { label: "Created At", name: "created_at", readOnly: true }
          ].map(({ label, name, readOnly }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={
                  name === "created_at"
                    ? new Date(profileData[name]).toLocaleDateString()
                    : profileData[name] || ""
                }
                onChange={handleChange}
                readOnly={!isEditing || readOnly}
                className={`mt-1 block w-full border border-gray-300 rounded px-3 py-2 ${!isEditing || readOnly ? 'bg-gray-100 outline-none' : ''}`}
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
