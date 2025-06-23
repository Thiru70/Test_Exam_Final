import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { Loader2 } from "lucide-react";

const ProfileForm = () => {
  const email = localStorage.getItem("adminEmail");
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading,setLoading] = useState(false)

  const fetchProfileData = async () => {
    setLoading(true)
    const response = await axiosInstance.get(`/company/profile/${email}`);
    setProfileData(response.data.profile);
    setLoading(false)
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

  if (loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

  const handleEditClick = () => {
    if (isEditing) {
      axiosInstance.put(`/company/profile/${email}`, profileData)
        .then(res => {
          console.log("Saved successfully", res.data);
          toast.success('Successfully updated the profile')
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
      <ToastContainer />
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
